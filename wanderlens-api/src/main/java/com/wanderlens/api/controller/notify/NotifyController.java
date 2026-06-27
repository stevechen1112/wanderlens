package com.wanderlens.api.controller.notify;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.NotifyMessage;
import com.wanderlens.api.entity.dto.DeviceTokenRequest;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.PushNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 通知 API
 */
@RestController
@RequestMapping("/notify")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Notify", description = "通知")
public class NotifyController {

    private final NotifyService notifyService;
    private final PushNotificationService pushNotificationService;

    @GetMapping("/unread")
    @Operation(summary = "未讀通知數")
    public Result<Integer> unreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(notifyService.getUnreadCount(userId));
    }

    @GetMapping("/page")
    @Operation(summary = "通知分頁")
    public Result<List<NotifyMessage>> notifications(HttpServletRequest request,
                                                     @RequestParam(defaultValue = "1") int page,
                                                     @RequestParam(defaultValue = "20") int size) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(notifyService.getNotifications(userId, page, size));
    }

    @PostMapping("/read/{id}")
    @Operation(summary = "標記已讀")
    public Result<Void> markAsRead(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        // 驗證通知擁有者：只能標記自己的通知為已讀
        NotifyMessage msg = notifyService.getById(id);
        if (msg == null) {
            return Result.error(ResultCode.NOTIFICATION_NOT_FOUND.getCode(), ResultCode.NOTIFICATION_NOT_FOUND.getMessage());
        }
        if (!userId.equals(msg.getMessageOwner())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限標記他人通知為已讀");
        }
        notifyService.markAsRead(id);
        return Result.ok();
    }

    @PostMapping("/device-token")
    @Operation(summary = "註冊 App 推播 device token")
    public Result<Void> registerDeviceToken(HttpServletRequest request,
                                            @Valid @RequestBody DeviceTokenRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        pushNotificationService.registerToken(
                userId, body.getToken(), body.getPlatform(), body.getAppType(), body.getDeviceId());
        return Result.ok();
    }

    @DeleteMapping("/device-token")
    @Operation(summary = "移除 App 推播 device token")
    public Result<Void> removeDeviceToken(HttpServletRequest request,
                                          @RequestBody DeviceTokenRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        if (body.getToken() == null || body.getToken().isBlank()) {
            return Result.error(ResultCode.BAD_REQUEST.getCode(), "缺少 token");
        }
        pushNotificationService.removeToken(userId, body.getToken());
        return Result.ok();
    }
}