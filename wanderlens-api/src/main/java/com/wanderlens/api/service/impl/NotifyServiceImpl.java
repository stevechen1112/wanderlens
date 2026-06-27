package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.NotifyMessage;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.mapper.NotifyMessageMapper;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.PushNotificationService;
import com.wanderlens.api.service.UserService;
import com.wanderlens.api.util.LineMessagingChannel;
import com.wanderlens.api.util.MailChannel;
import com.wanderlens.api.util.SmsChannel;
import com.wanderlens.api.util.WhatsAppChannel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 通知服務實作
 *
 * 可插拔通道架構：
 * - 站內通知（永遠發送）
 * - LINE Messaging API（如有 lineUserId）
 * - Email（如有 email）
 * - SMS（僅重要流程）
 *
 * 未來 Phase 5 新增 WhatsApp / Telegram 只需：
 * 1. 實作 NotifyChannel 介面
 * 2. 在此注入並加入發送呼叫
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotifyServiceImpl extends ServiceImpl<NotifyMessageMapper, NotifyMessage> implements NotifyService {

    private final UserService userService;
    private final LineMessagingChannel lineChannel;
    private final MailChannel mailChannel;
    private final SmsChannel smsChannel;
    private final WhatsAppChannel whatsAppChannel;
    private final PushNotificationService pushNotificationService;

    @Override
    public void sendInAppNotification(Long userId, String message, String url) {
        NotifyMessage notify = new NotifyMessage();
        notify.setMessageOwner(userId);
        notify.setMessage(message);
        notify.setMessageUrl(url);
        notify.setIsRead(false);
        save(notify);
    }

    @Override
    public void triggerFlow(String flowType, Long userId, String subject, String content) {
        triggerFlow(flowType, userId, subject, content, null, null, null);
    }

    @Override
    public void triggerFlow(String flowType, Long userId, String subject, String content,
                            String url, Long orderId, Long albumId) {
        log.info("觸發通知流程: flowType={}, userId={}, subject={}", flowType, userId, subject);

        // 1. 站內通知（永遠發送）
        sendInAppNotification(userId, subject + " — " + content, url);

        // 1b. App 推播（Expo / FCM）
        java.util.Map<String, String> pushData = new java.util.HashMap<>();
        pushData.put("flowType", flowType);
        if (url != null) pushData.put("url", url);
        if (orderId != null) pushData.put("orderId", orderId.toString());
        if (albumId != null) pushData.put("albumId", albumId.toString());
        pushNotificationService.sendToUser(userId, subject, content, url, pushData);

        // 2. 取得使用者資訊
        User user = userService.getById(userId);
        if (user == null) {
            log.warn("通知流程：使用者不存在 userId={}", userId);
            return;
        }

        // 組合完整訊息
        String fullMessage = subject + " — " + content;

        // 3. LINE Messaging API（如有 lineUserId）
        String lineTarget = user.getLineUserId() != null && !user.getLineUserId().isEmpty()
                ? user.getLineUserId()
                : user.getLineToken();
        if (lineTarget != null && !lineTarget.isEmpty()) {
            lineChannel.send(lineTarget, fullMessage);
        }

        // 4. Email（如有）
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            mailChannel.send(user.getEmail(), fullMessage);
        }

        // 5. SMS（僅重要流程）
        if (shouldSendSms(flowType) && user.getPhone() != null && !user.getPhone().isEmpty()) {
            smsChannel.send(user.getPhone(), fullMessage);
        }

        // 6. WhatsApp（跨境用戶，sourceCountry 非 TW）
        if (user.getPhone() != null && isOverseasUser(user)) {
            whatsAppChannel.send(user.getPhone(), fullMessage);
        }
    }

    private boolean isOverseasUser(User user) {
        // 簡化：手機非 +886 / 09 開頭視為跨境
        String phone = user.getPhone();
        if (phone == null) return false;
        return !(phone.startsWith("+886") || phone.startsWith("09") || phone.startsWith("886"));
    }

    @Override
    public int getUnreadCount(Long userId) {
        return baseMapper.countUnread(userId);
    }

    @Override
    public List<NotifyMessage> getNotifications(Long userId, int page, int size) {
        Page<NotifyMessage> pageResult = page(
                new Page<>(page, size),
                new LambdaQueryWrapper<NotifyMessage>()
                        .eq(NotifyMessage::getMessageOwner, userId)
                        .orderByDesc(NotifyMessage::getCreatedAt));
        return pageResult.getRecords();
    }

    @Override
    public void markAsRead(Long notifyId) {
        update(new LambdaUpdateWrapper<NotifyMessage>()
                .eq(NotifyMessage::getId, notifyId)
                .set(NotifyMessage::getIsRead, true));
    }

    /**
     * 判斷是否需要發送簡訊（僅重要流程）
     */
    private boolean shouldSendSms(String flowType) {
        return "order_paid".equals(flowType)
                || "payment_failed".equals(flowType)
                || "contact_reminder".equals(flowType)
                || "upload_reminder".equals(flowType)
                || "sla_alert".equals(flowType);
    }
}