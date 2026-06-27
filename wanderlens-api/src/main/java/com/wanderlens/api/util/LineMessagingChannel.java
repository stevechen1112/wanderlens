package com.wanderlens.api.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * LINE Messaging API 通知通道
 *
 * 取代即將停用的 LINE Notify，改用 LINE Official Account Messaging API。
 * - 一對一推播訊息給已加好友的使用者
 * - 支援文字、圖片、按鈕模板
 * - 免費額度 200 則/月（輕量方案），超量需升級
 *
 * 前置條件：
 * - 建立 LINE Official Account（官方帳號）
 * - 取得 Channel Access Token
 * - 使用者需先加官方帳號為好友
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LineMessagingChannel implements NotifyChannel {

    @Value("${wanderlens.line.channel-access-token:}")
    private String channelAccessToken;

    @Value("${wanderlens.line.messaging-api-url:https://api.line.me/v2/bot}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getName() {
        return "LINE_MESSAGING";
    }

    @Override
    public boolean isAvailable(String recipient) {
        // recipient = LINE user ID（需使用者先加官方帳號好友）
        return channelAccessToken != null && !channelAccessToken.isEmpty()
                && recipient != null && !recipient.isEmpty();
    }

    @Override
    public boolean send(String recipient, String message) {
        if (!isAvailable(recipient)) {
            log.debug("LINE Messaging 不可用: recipient={}", recipient);
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + channelAccessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("to", recipient);

            Map<String, Object> messageObj = new HashMap<>();
            messageObj.put("type", "text");
            messageObj.put("text", message);

            body.put("messages", List.of(messageObj));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl + "/message/push", request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("LINE Messaging 發送成功: recipient={}", recipient);
                return true;
            } else {
                log.warn("LINE Messaging 發送失敗: status={}, body={}",
                        response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.error("LINE Messaging 發送例外: recipient={}", recipient, e);
            return false;
        }
    }

    @Override
    public boolean sendWithImage(String recipient, String message, String imageUrl) {
        if (!isAvailable(recipient)) {
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + channelAccessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 發送兩則訊息：文字 + 圖片
            Map<String, Object> textMsg = new HashMap<>();
            textMsg.put("type", "text");
            textMsg.put("text", message);

            Map<String, Object> imageMsg = new HashMap<>();
            imageMsg.put("type", "image");
            imageMsg.put("originalContentUrl", imageUrl);
            imageMsg.put("previewImageUrl", imageUrl);

            Map<String, Object> body = new HashMap<>();
            body.put("to", recipient);
            body.put("messages", List.of(textMsg, imageMsg));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl + "/message/push", request, String.class);

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.error("LINE Messaging 含圖片發送例外", e);
            return false;
        }
    }

    /**
     * 發送按鈕模板訊息（用於訂單通知含行動按鈕）
     *
     * 範例：訂單成立通知 + 「查看訂單」按鈕
     */
    public boolean sendButtonTemplate(String recipient, String title, String text,
                                       String actionLabel, String actionUri) {
        if (!isAvailable(recipient)) {
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + channelAccessToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> action = new HashMap<>();
            action.put("type", "uri");
            action.put("label", actionLabel);
            action.put("uri", actionUri);

            Map<String, Object> template = new HashMap<>();
            template.put("type", "buttons");
            template.put("title", title);
            template.put("text", text);
            template.put("actions", List.of(action));

            Map<String, Object> messageObj = new HashMap<>();
            messageObj.put("type", "template");
            messageObj.put("altText", title);
            messageObj.put("template", template);

            Map<String, Object> body = new HashMap<>();
            body.put("to", recipient);
            body.put("messages", List.of(messageObj));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    apiUrl + "/message/push", request, String.class);

            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            log.error("LINE Messaging 按鈕模板發送例外", e);
            return false;
        }
    }
}