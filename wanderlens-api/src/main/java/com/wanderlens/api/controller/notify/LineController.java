package com.wanderlens.api.controller.notify;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.service.UserService;
import com.wanderlens.api.util.LineMessagingChannel;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * LINE Messaging API Controller
 */
@Slf4j
@RestController
@RequestMapping("/line")
@RequiredArgsConstructor
@Tag(name = "LINE", description = "LINE Messaging API")
public class LineController {

    private final LineMessagingChannel lineChannel;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @PostMapping("/webhook")
    @Operation(summary = "LINE Webhook")
    public Result<Void> webhook(@RequestBody String payload) {
        log.info("LINE Webhook received");
        try {
            JsonNode root = objectMapper.readTree(payload);
            JsonNode events = root.path("events");
            if (!events.isArray()) return Result.ok();

            for (JsonNode event : events) {
                String type = event.path("type").asText();
                String lineUserId = event.path("source").path("userId").asText(null);
                if (lineUserId == null) continue;

                if ("follow".equals(type)) {
                    log.info("LINE follow: userId={}", lineUserId);
                    lineChannel.send(lineUserId, "歡迎加入 WanderLens！請至 App 或網站「個人設定」綁定帳號，即可接收訂單通知。");
                } else if ("message".equals(type)) {
                    String text = event.path("message").path("text").asText("");
                    // 綁定格式：BIND <empno>
                    if (text.startsWith("BIND ")) {
                        String empno = text.substring(5).trim();
                        User user = userService.getOne(new LambdaQueryWrapper<User>().eq(User::getEmpno, empno));
                        if (user != null) {
                            user.setLineUserId(lineUserId);
                            userService.updateById(user);
                            lineChannel.send(lineUserId, "帳號綁定成功！您將收到 WanderLens 訂單與交付通知。");
                            log.info("LINE 綁定成功: empno={}, lineUserId={}", empno, lineUserId);
                        } else {
                            lineChannel.send(lineUserId, "找不到此帳號，請確認後再試。");
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("LINE Webhook 解析失敗", e);
        }
        return Result.ok();
    }

    @PostMapping("/notify")
    @Operation(summary = "發送 LINE 訊息（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Boolean> sendNotify(HttpServletRequest request,
                                      @RequestParam String lineUserId,
                                      @RequestParam String message) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限發送 LINE 訊息");
        }
        return Result.ok(lineChannel.send(lineUserId, message));
    }

    @PostMapping("/notify/button")
    @Operation(summary = "發送含按鈕的 LINE 訊息（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Boolean> sendButtonNotify(HttpServletRequest request,
                                            @RequestParam String lineUserId,
                                            @RequestParam String title,
                                            @RequestParam String text,
                                            @RequestParam String actionLabel,
                                            @RequestParam String actionUri) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限發送 LINE 訊息");
        }
        return Result.ok(lineChannel.sendButtonTemplate(lineUserId, title, text, actionLabel, actionUri));
    }
}
