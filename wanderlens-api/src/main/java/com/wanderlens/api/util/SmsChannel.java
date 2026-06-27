package com.wanderlens.api.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

/**
 * SMS 通知通道
 * - dev 環境：Twilio
 * - prod 環境：三竹 SMS
 *
 * 實作 NotifyChannel 介面，recipient = 手機號碼
 */
@Slf4j
@Component
public class SmsChannel implements NotifyChannel {

    @Value("${wanderlens.sms.provider:twilio}")
    private String provider;

    @Value("${wanderlens.sms.twilio-account-sid:}")
    private String twilioSid;

    @Value("${wanderlens.sms.twilio-auth-token:}")
    private String twilioToken;

    @Value("${wanderlens.sms.twilio-phone:}")
    private String twilioPhone;

    @Value("${wanderlens.sms.mitake-url:https://smsapi.mitake.com.tw}")
    private String mitakeUrl;

    @Value("${wanderlens.sms.mitake-username:}")
    private String mitakeUsername;

    @Value("${wanderlens.sms.mitake-password:}")
    private String mitakePassword;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Override
    public String getName() {
        return "SMS";
    }

    @Override
    public boolean isAvailable(String recipient) {
        return recipient != null && !recipient.isEmpty();
    }

    @Override
    public boolean send(String recipient, String message) {
        if (!isAvailable(recipient)) {
            log.warn("SMS: 手機號碼為空，跳過發送");
            return false;
        }

        try {
            if ("twilio".equals(provider)) {
                return sendViaTwilio(recipient, message);
            } else {
                return sendViaMitake(recipient, message);
            }
        } catch (Exception e) {
            log.error("SMS 發送例外: phone={}", recipient, e);
            return false;
        }
    }

    @Override
    public boolean sendWithImage(String recipient, String message, String imageUrl) {
        // SMS 不支援圖片，僅發送文字（可附短連結）
        return send(recipient, message + (imageUrl != null ? " " + imageUrl : ""));
    }

    private boolean sendViaTwilio(String phone, String message) {
        if (twilioSid == null || twilioSid.isBlank() || twilioToken == null || twilioToken.isBlank()) {
            log.info("[Twilio] 未設定憑證，模擬發送: phone={}", phone);
            return true;
        }
        try {
            String body = "To=" + URLEncoder.encode(phone, StandardCharsets.UTF_8)
                    + "&From=" + URLEncoder.encode(twilioPhone, StandardCharsets.UTF_8)
                    + "&Body=" + URLEncoder.encode(message, StandardCharsets.UTF_8);
            String auth = Base64.getEncoder().encodeToString((twilioSid + ":" + twilioToken).getBytes(StandardCharsets.UTF_8));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json"))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("[Twilio] SMS: phone={}, status={}", phone, response.statusCode());
            return response.statusCode() >= 200 && response.statusCode() < 300;
        } catch (Exception e) {
            log.error("[Twilio] 發送失敗", e);
            return false;
        }
    }

    private boolean sendViaMitake(String phone, String message) {
        try {
            String url = mitakeUrl + "/api/SmSend?" +
                    "UserName=" + mitakeUsername +
                    "&Password=" + mitakePassword +
                    "&Mobile=" + phone +
                    "&Message=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("[三竹] SMS: phone={}, response={}", phone, response.body());
            return response.statusCode() == 200;
        } catch (Exception e) {
            log.error("三竹 SMS 發送例外", e);
            return false;
        }
    }
}