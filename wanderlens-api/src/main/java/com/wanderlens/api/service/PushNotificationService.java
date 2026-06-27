package com.wanderlens.api.service;

public interface PushNotificationService {

    void registerToken(Long userId, String token, String platform, String appType, String deviceId);

    void removeToken(Long userId, String token);

    void sendToUser(Long userId, String title, String body, String url);

    void sendToUser(Long userId, String title, String body, String url, java.util.Map<String, String> data);
}
