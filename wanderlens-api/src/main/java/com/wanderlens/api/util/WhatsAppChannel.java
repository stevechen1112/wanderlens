package com.wanderlens.api.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

/**
 * WhatsApp Business Cloud API 通知通道（Phase 5 跨境）
 */
@Slf4j
@Component
public class WhatsAppChannel implements NotifyChannel {

    @Value("${wanderlens.whatsapp.phone-number-id:}")
    private String phoneNumberId;

    @Value("${wanderlens.whatsapp.access-token:}")
    private String accessToken;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Override
    public String getName() {
        return "WhatsApp";
    }

    @Override
    public boolean isAvailable(String recipient) {
        return recipient != null && !recipient.isEmpty()
                && phoneNumberId != null && !phoneNumberId.isBlank()
                && accessToken != null && !accessToken.isBlank();
    }

    @Override
    public boolean send(String recipient, String message) {
        if (!isAvailable(recipient)) {
            log.debug("WhatsApp 未設定或 recipient 為空，跳過");
            return false;
        }
        try {
            String normalized = recipient.replace("+", "").replace(" ", "");
            String body = """
                    {"messaging_product":"whatsapp","to":"%s","type":"text","text":{"body":"%s"}}
                    """.formatted(normalized, escapeJson(message));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://graph.facebook.com/v19.0/" + phoneNumberId + "/messages"))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("[WhatsApp] to={}, status={}", normalized, response.statusCode());
            return response.statusCode() >= 200 && response.statusCode() < 300;
        } catch (Exception e) {
            log.error("WhatsApp 發送失敗", e);
            return false;
        }
    }

    @Override
    public boolean sendWithImage(String recipient, String message, String imageUrl) {
        return send(recipient, message + (imageUrl != null ? " " + imageUrl : ""));
    }

    private static String escapeJson(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n");
    }
}
