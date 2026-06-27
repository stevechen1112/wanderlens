package com.wanderlens.api.util;

/**
 * 通知通道介面（可插拔架構）
 *
 * 未來新增 WhatsApp / Telegram 只需實作此介面：
 * - LineMessagingChannel   ← Phase 1（取代 LINE Notify）
 * - SmsChannel             ← Phase 1
 * - MailChannel            ← Phase 1
 * - WhatsAppChannel        ← Phase 5（跨境）
 * - TelegramChannel        ← Phase 5（可選）
 */
public interface NotifyChannel {

    /**
     * 通道名稱
     */
    String getName();

    /**
     * 發送純文字通知
     */
    boolean send(String recipient, String message);

    /**
     * 發送含圖片通知
     */
    boolean sendWithImage(String recipient, String message, String imageUrl);

    /**
     * 此通道是否可用（token/設定是否存在）
     */
    boolean isAvailable(String recipient);
}