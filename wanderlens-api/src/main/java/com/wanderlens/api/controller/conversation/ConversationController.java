package com.wanderlens.api.controller.conversation;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Conversation;
import com.wanderlens.api.entity.ConversationAccessLog;
import com.wanderlens.api.entity.ConversationParticipant;
import com.wanderlens.api.entity.Message;
import com.wanderlens.api.entity.dto.ConversationSummaryDto;
import com.wanderlens.api.entity.dto.OpenSupportConversationRequest;
import com.wanderlens.api.entity.dto.SendMessageRequest;
import com.wanderlens.api.entity.dto.AddParticipantRequest;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.service.ConversationEventHub;
import com.wanderlens.api.service.ConversationService;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.LocalFileStorageService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Conversation", description = "站內溝通")
public class ConversationController {

    private final ConversationService conversationService;
    private final AuthUtil authUtil;
    private final LocalFileStorageService fileStorageService;
    private final OrderService orderService;
    private final ConversationEventHub eventHub;

    @GetMapping
    @Operation(summary = "我的溝通室列表（含最後訊息、未讀數）")
    public Result<List<ConversationSummaryDto>> myConversations(HttpServletRequest request) {
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        return Result.ok(conversationService.getMyConversationSummaries(userId, role));
    }

    @GetMapping("/support")
    @Operation(summary = "客服/管理通道列表（後台）")
    public Result<List<ConversationSummaryDto>> supportConversations(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(conversationService.getSupportConversationSummaries());
    }

    @PostMapping("/customer-service")
    @Operation(summary = "開啟或取得客服通道（消費者）")
    public Result<Conversation> openCustomerService(HttpServletRequest request,
                                                    @RequestBody(required = false) SendMessageRequest body) {
        authUtil.requireRole(request, "CONSUMER");
        Long userId = authUtil.getUserId(request);
        String msg = body != null ? body.getContent() : null;
        return Result.ok(conversationService.openCustomerServiceConversation(userId, msg));
    }

    @PostMapping("/admin-channel")
    @Operation(summary = "開啟管理通道（後台 → 供給方）")
    public Result<Conversation> openAdminChannel(HttpServletRequest request,
                                                 @Valid @RequestBody OpenSupportConversationRequest body) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        Long adminId = authUtil.getUserId(request);
        Conversation conv = conversationService.openAdminConversation(body.getTargetUserId());
        if (body.getInitialMessage() != null && !body.getInitialMessage().isBlank()) {
            conversationService.sendTextMessage(conv.getId(), adminId,
                    authUtil.getRole(request), body.getInitialMessage());
        }
        return Result.ok(conv);
    }

    @GetMapping("/{id}")
    @Operation(summary = "溝通室詳情")
    public Result<Conversation> getConversation(HttpServletRequest request, @PathVariable Long id) {
        Conversation conv = conversationService.getById(id);
        if (conv == null) return Result.ok(null);
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        authUtil.requireConversationAccess(userId, role, conv.getId());
        return Result.ok(conv);
    }

    @GetMapping("/{id}/messages")
    @Operation(summary = "訊息列表（分頁）")
    public Result<List<Message>> getMessages(HttpServletRequest request,
                                             @PathVariable Long id,
                                             @RequestParam(defaultValue = "1") int page,
                                             @RequestParam(defaultValue = "50") int size) {
        Conversation conv = conversationService.getById(id);
        if (conv == null) return Result.ok(null);
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        authUtil.requireConversationAccess(userId, role, conv.getId());
        return Result.ok(conversationService.getMessages(id, page, size));
    }

    @GetMapping(value = "/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "訊息即時推送（SSE）")
    public SseEmitter streamMessages(HttpServletRequest request, @PathVariable Long id) {
        Conversation conv = conversationService.getById(id);
        if (conv == null) {
            throw new com.wanderlens.api.exception.ServiceException(
                    com.wanderlens.api.common.ResultCode.NOT_FOUND, "對話不存在");
        }
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        authUtil.requireConversationAccess(userId, role, conv.getId());
        return eventHub.subscribe(id);
    }

    @PostMapping("/{id}/messages")
    @Operation(summary = "發送文字訊息")
    public Result<Message> sendMessage(HttpServletRequest request,
                                       @PathVariable Long id,
                                       @Valid @RequestBody SendMessageRequest body) {
        Long senderId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        return Result.ok(conversationService.sendTextMessage(id, senderId, role, body.getContent()));
    }

    @PostMapping("/{id}/messages/image")
    @Operation(summary = "發送圖片訊息（URL）")
    public Result<Message> sendImage(HttpServletRequest request,
                                     @PathVariable Long id,
                                     @RequestParam String imageUrl) {
        Long senderId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        return Result.ok(conversationService.sendImageMessage(id, senderId, role, imageUrl));
    }

    @PostMapping("/{id}/messages/image-upload")
    @Operation(summary = "上傳並發送圖片訊息")
    public Result<Message> uploadImage(HttpServletRequest request,
                                       @PathVariable Long id,
                                       @RequestParam("file") MultipartFile file) throws IOException {
        Long senderId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        Conversation conv = conversationService.getById(id);
        if (conv == null) {
            return Result.error(ResultCode.CONVERSATION_NOT_FOUND.getCode(), ResultCode.CONVERSATION_NOT_FOUND.getMessage());
        }
        authUtil.requireConversationAccess(senderId, role, conv.getId());
        String url = fileStorageService.store("conversation", UUID.randomUUID().toString(), file);
        return Result.ok(conversationService.sendImageMessage(id, senderId, role, url));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "標記已讀")
    public Result<Void> markAsRead(HttpServletRequest request, @PathVariable Long id) {
        Conversation conv = conversationService.getById(id);
        if (conv == null) {
            return Result.error(ResultCode.CONVERSATION_NOT_FOUND.getCode(), ResultCode.CONVERSATION_NOT_FOUND.getMessage());
        }
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        authUtil.requireConversationAccess(userId, role, conv.getId());
        conversationService.markAsRead(id, userId, role);
        return Result.ok();
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "取得訂單溝通室")
    public Result<Conversation> getOrderConversation(HttpServletRequest request,
                                                     @PathVariable Long orderId,
                                                     @RequestParam(required = false) Long providerId) {
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        Conversation conv = conversationService.getOrderConversation(orderId, providerId);
        if (conv == null) {
            return Result.error(ResultCode.NOT_FOUND.getCode(), "此訂單尚無溝通室");
        }
        authUtil.requireConversationAccess(userId, role, conv.getId());
        return Result.ok(conv);
    }

    @GetMapping("/order/{orderId}/all")
    @Operation(summary = "取得訂單所有溝通室")
    public Result<List<Conversation>> getOrderConversations(HttpServletRequest request,
                                                              @PathVariable Long orderId) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        return Result.ok(conversationService.getOrderConversations(orderId));
    }

    @GetMapping("/{id}/access-log")
    @Operation(summary = "調閱日誌（後台）")
    public Result<List<ConversationAccessLog>> getAccessLogs(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(conversationService.getAccessLogs(id));
    }

    @PostMapping("/{id}/access")
    @Operation(summary = "調閱溝通記錄（後台）")
    public Result<List<Message>> accessMessages(HttpServletRequest request,
                                                @PathVariable Long id,
                                                @RequestParam String reason) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        Long accessorId = authUtil.getUserId(request);
        return Result.ok(conversationService.accessMessages(id, accessorId, reason));
    }

    // ── 參與者管理 ──

    @GetMapping("/{id}/participants")
    @Operation(summary = "查看對話參與者列表")
    public Result<List<ConversationParticipant>> getParticipants(HttpServletRequest request, @PathVariable Long id) {
        Long userId = authUtil.getUserId(request);
        String role = authUtil.getRole(request);
        authUtil.requireConversationAccess(userId, role, id);
        // 一般用戶只看活躍參與者；站方可看全部（含已移除）
        boolean activeOnly = !"ADMIN".equals(role) && !"SUPPORT".equals(role);
        return Result.ok(conversationService.getParticipants(id, activeOnly));
    }

    @PostMapping("/{id}/participants")
    @Operation(summary = "新增參與者（站方）")
    public Result<ConversationParticipant> addParticipant(HttpServletRequest request,
                                                          @PathVariable Long id,
                                                          @Valid @RequestBody AddParticipantRequest body) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(conversationService.addParticipant(id, body.getUserId(), body.getUserType()));
    }

    @DeleteMapping("/{id}/participants/{userId}")
    @Operation(summary = "移除參與者（站方）")
    public Result<Void> removeParticipant(HttpServletRequest request,
                                            @PathVariable Long id,
                                            @PathVariable Long userId) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        Long removedBy = authUtil.getUserId(request);
        conversationService.removeParticipant(id, userId, removedBy);
        return Result.ok();
    }
}
