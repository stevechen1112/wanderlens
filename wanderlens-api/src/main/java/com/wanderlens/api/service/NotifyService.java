package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.NotifyMessage;

import java.util.List;

public interface NotifyService extends IService<NotifyMessage> {

    /**
     * 發送站內通知
     */
    void sendInAppNotification(Long userId, String message, String url);

    /**
     * 依 flowType 觸發通知流程（LINE + Email + SMS + 站內通知）
     */
    void triggerFlow(String flowType, Long userId, String subject, String content);

    /**
     * 含深層連結與結構化推播資料
     */
    void triggerFlow(String flowType, Long userId, String subject, String content, String url, Long orderId, Long albumId);

    /**
     * 取得未讀通知數
     */
    int getUnreadCount(Long userId);

    /**
     * 取得通知分頁
     */
    List<NotifyMessage> getNotifications(Long userId, int page, int size);

    /**
     * 標記已讀
     */
    void markAsRead(Long notifyId);
}