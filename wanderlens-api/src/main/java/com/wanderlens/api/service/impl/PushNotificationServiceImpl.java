package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.wanderlens.api.entity.NotifyDeviceToken;
import com.wanderlens.api.mapper.NotifyDeviceTokenMapper;
import com.wanderlens.api.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationServiceImpl implements PushNotificationService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    private final NotifyDeviceTokenMapper deviceTokenMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${wanderlens.push.enabled:true}")
    private boolean pushEnabled;

    @Override
    public void registerToken(Long userId, String token, String platform, String appType, String deviceId) {
        NotifyDeviceToken existing = deviceTokenMapper.selectOne(
                new LambdaQueryWrapper<NotifyDeviceToken>().eq(NotifyDeviceToken::getToken, token));

        if (existing != null && !existing.getUserId().equals(userId)) {
            log.warn("Push token already registered to another user, rejecting reassign: token={}", token.substring(0, Math.min(12, token.length())));
            return;
        }

        if (existing != null) {
            existing.setUserId(userId);
            existing.setPlatform(platform != null ? platform : "EXPO");
            existing.setAppType(appType != null ? appType : "CONSUMER");
            existing.setDeviceId(deviceId);
            existing.setActive(true);
            deviceTokenMapper.updateById(existing);
            return;
        }

        NotifyDeviceToken record = new NotifyDeviceToken();
        record.setUserId(userId);
        record.setToken(token);
        record.setPlatform(platform != null ? platform : "EXPO");
        record.setAppType(appType != null ? appType : "CONSUMER");
        record.setDeviceId(deviceId);
        record.setActive(true);
        deviceTokenMapper.insert(record);
    }

    @Override
    public void removeToken(Long userId, String token) {
        deviceTokenMapper.update(null, new LambdaUpdateWrapper<NotifyDeviceToken>()
                .eq(NotifyDeviceToken::getUserId, userId)
                .eq(NotifyDeviceToken::getToken, token)
                .set(NotifyDeviceToken::getActive, false));
    }

    @Override
    public void sendToUser(Long userId, String title, String body, String url) {
        sendToUser(userId, title, body, url, null);
    }

    @Override
    public void sendToUser(Long userId, String title, String body, String url, Map<String, String> data) {
        if (!pushEnabled) return;

        List<NotifyDeviceToken> tokens = deviceTokenMapper.selectList(
                new LambdaQueryWrapper<NotifyDeviceToken>()
                        .eq(NotifyDeviceToken::getUserId, userId)
                        .eq(NotifyDeviceToken::getActive, true));

        for (NotifyDeviceToken dt : tokens) {
            if ("EXPO".equalsIgnoreCase(dt.getPlatform()) || dt.getToken().startsWith("ExponentPushToken")) {
                sendExpoPush(dt.getToken(), title, body, url, data);
            } else {
                log.debug("FCM token registered but Firebase Admin SDK not configured: userId={}", userId);
            }
        }
    }

    private void sendExpoPush(String expoToken, String title, String body, String url, Map<String, String> data) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("to", expoToken);
            payload.put("title", title);
            payload.put("body", body);
            payload.put("sound", "default");
            Map<String, String> pushData = new HashMap<>();
            if (url != null) pushData.put("url", url);
            if (data != null) pushData.putAll(data);
            if (!pushData.isEmpty()) {
                payload.put("data", pushData);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Accept", "application/json");

            restTemplate.postForEntity(EXPO_PUSH_URL, new HttpEntity<>(payload, headers), String.class);
        } catch (Exception e) {
            log.warn("Expo push failed: {}", e.getMessage());
        }
    }
}
