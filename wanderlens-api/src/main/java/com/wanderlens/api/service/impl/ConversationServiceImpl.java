package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.AppConstant;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Conversation;
import com.wanderlens.api.entity.ConversationAccessLog;
import com.wanderlens.api.entity.ConversationParticipant;
import com.wanderlens.api.entity.Message;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.entity.dto.ConversationSummaryDto;
import com.wanderlens.api.entity.enums.ConversationStatus;
import com.wanderlens.api.entity.enums.ConversationType;
import com.wanderlens.api.entity.enums.MessageType;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.ConversationAccessLogMapper;
import com.wanderlens.api.mapper.ConversationMapper;
import com.wanderlens.api.mapper.ConversationParticipantMapper;
import com.wanderlens.api.mapper.MessageMapper;
import com.wanderlens.api.mapper.UserMapper;
import com.wanderlens.api.service.ConversationEventHub;
import com.wanderlens.api.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversationServiceImpl extends ServiceImpl<ConversationMapper, Conversation> implements ConversationService {

    private final MessageMapper messageMapper;
    private final ConversationAccessLogMapper accessLogMapper;
    private final ConversationParticipantMapper participantMapper;
    private final UserMapper userMapper;
    private final ConversationEventHub eventHub;

    private static final Pattern PHONE_PATTERN = Pattern.compile("(09|\\+8869|\\+886-9)\\d{8}");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");

    @Override
    public List<ConversationSummaryDto> getMyConversationSummaries(Long userId, String role) {
        List<Conversation> conversations;
        if (isStaffRole(role)) {
            conversations = list(new LambdaQueryWrapper<Conversation>()
                    .in(Conversation::getConversationType,
                            ConversationType.CUSTOMER_SERVICE.getCode(),
                            ConversationType.ADMIN.getCode())
                    .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                    .orderByDesc(Conversation::getModifiedAt));
        } else {
            // 查 participant 表找出所有活躍參與的對話
            List<Long> conversationIds = participantMapper.selectList(
                    new LambdaQueryWrapper<ConversationParticipant>()
                            .eq(ConversationParticipant::getUserId, userId)
                            .eq(ConversationParticipant::getIsActive, true)
                            .select(ConversationParticipant::getConversationId)
            ).stream().map(ConversationParticipant::getConversationId).toList();

            if (conversationIds.isEmpty()) return Collections.emptyList();

            conversations = list(new LambdaQueryWrapper<Conversation>()
                    .in(Conversation::getId, conversationIds)
                    .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                    .orderByDesc(Conversation::getModifiedAt));
        }
        return toSummaries(conversations, userId, role);
    }

    @Override
    public List<ConversationSummaryDto> getSupportConversationSummaries() {
        List<Conversation> conversations = list(new LambdaQueryWrapper<Conversation>()
                .in(Conversation::getConversationType,
                        ConversationType.CUSTOMER_SERVICE.getCode(),
                        ConversationType.ADMIN.getCode())
                .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                .orderByDesc(Conversation::getModifiedAt));
        return toSummaries(conversations, AppConstant.PLATFORM_USER_ID, "SUPPORT");
    }

    /**
     * 取得訂單對話室（一個訂單只有一個多人對話，providerId 已不再使用）
     * @param orderId 訂單 ID
     * @param providerId 已棄用，保留向後相容
     */
    @Override
    public Conversation getOrderConversation(Long orderId, Long providerId) {
        return getOne(new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getOrderId, orderId)
                .eq(Conversation::getConversationType, ConversationType.ORDER.getCode()));
    }

    @Override
    public List<Conversation> getOrderConversations(Long orderId) {
        return list(new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getOrderId, orderId)
                .eq(Conversation::getConversationType, ConversationType.ORDER.getCode()));
    }

    @Override
    @Transactional
    public Conversation openOrderConversation(Long orderId, List<Long> participantIds, List<String> userTypes) {
        // 查是否已有該訂單的對話室（一個訂單只有一個多人對話）
        Conversation existing = getOne(new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getOrderId, orderId)
                .eq(Conversation::getConversationType, ConversationType.ORDER.getCode()));

        if (existing != null) {
            // 已存在，檢查是否有新參與者需要加入
            for (int i = 0; i < participantIds.size(); i++) {
                addParticipantIfNotExists(existing.getId(), participantIds.get(i), userTypes.get(i));
            }
            return existing;
        }

        // 新建對話室
        Conversation conversation = new Conversation();
        conversation.setConversationType(ConversationType.ORDER.getCode());
        conversation.setOrderId(orderId);
        conversation.setStatus(ConversationStatus.OPEN.getCode());
        save(conversation);

        // 寫入所有參與者（silent=true，不發系統訊息，避免新建時訊息冗餘）
        for (int i = 0; i < participantIds.size(); i++) {
            addParticipantInternal(conversation.getId(), participantIds.get(i), userTypes.get(i), true);
        }

        sendSystemMessage(conversation.getId(),
                "訂單已成立，供給方請於 24 小時內主動聯繫客戶確認拍攝細節。");
        log.info("開啟訂單溝通室（多人）: orderId={}, participants={}", orderId, participantIds);
        return conversation;
    }

    @Override
    @Transactional
    public Conversation openCustomerServiceConversation(Long consumerId, String initialMessage) {
        Conversation existing = getOne(new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getConversationType, ConversationType.CUSTOMER_SERVICE.getCode())
                .eq(Conversation::getParticipantBId, consumerId)
                .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                .last("LIMIT 1"));
        if (existing != null) {
            // 確保 participant 表有記錄（migration 後新建的對話可能遺漏）
            addParticipantIfNotExists(existing.getId(), AppConstant.PLATFORM_USER_ID, "ADMIN");
            addParticipantIfNotExists(existing.getId(), consumerId, "CONSUMER");
            if (initialMessage != null && !initialMessage.isBlank()) {
                sendTextMessage(existing.getId(), consumerId, "CONSUMER", initialMessage);
            }
            return existing;
        }

        Conversation conversation = new Conversation();
        conversation.setConversationType(ConversationType.CUSTOMER_SERVICE.getCode());
        conversation.setParticipantAId(AppConstant.PLATFORM_USER_ID);
        conversation.setParticipantBId(consumerId);
        conversation.setStatus(ConversationStatus.OPEN.getCode());
        save(conversation);
        // 寫入 participant 表（silent=true，不發系統訊息）
        addParticipantInternal(conversation.getId(), AppConstant.PLATFORM_USER_ID, "ADMIN", true);
        addParticipantInternal(conversation.getId(), consumerId, "CONSUMER", true);
        sendSystemMessage(conversation.getId(), "客服通道已開啟，WanderLens 將盡快回覆您。");
        if (initialMessage != null && !initialMessage.isBlank()) {
            sendTextMessage(conversation.getId(), consumerId, "CONSUMER", initialMessage);
        }
        return conversation;
    }

    @Override
    @Transactional
    public Conversation openAdminConversation(Long providerId) {
        Conversation existing = getOne(new LambdaQueryWrapper<Conversation>()
                .eq(Conversation::getConversationType, ConversationType.ADMIN.getCode())
                .eq(Conversation::getParticipantBId, providerId)
                .ne(Conversation::getStatus, ConversationStatus.CLOSED.getCode())
                .last("LIMIT 1"));
        if (existing != null) {
            // 確保 participant 表有記錄（migration 後新建的對話可能遺漏）
            addParticipantIfNotExists(existing.getId(), AppConstant.PLATFORM_USER_ID, "ADMIN");
            addParticipantIfNotExists(existing.getId(), providerId, "PHOTOGRAPHER");
            return existing;
        }

        Conversation conversation = new Conversation();
        conversation.setConversationType(ConversationType.ADMIN.getCode());
        conversation.setParticipantAId(AppConstant.PLATFORM_USER_ID);
        conversation.setParticipantBId(providerId);
        conversation.setStatus(ConversationStatus.OPEN.getCode());
        save(conversation);
        // 寫入 participant 表（silent=true，不發系統訊息）
        addParticipantInternal(conversation.getId(), AppConstant.PLATFORM_USER_ID, "ADMIN", true);
        addParticipantInternal(conversation.getId(), providerId, "PHOTOGRAPHER", true);
        sendSystemMessage(conversation.getId(), "平台管理通道已開啟。");
        return conversation;
    }

    @Override
    @Transactional
    public void setReadonly(Long conversationId) {
        Conversation conversation = getById(conversationId);
        if (conversation == null) {
            throw new ServiceException(ResultCode.CONVERSATION_NOT_FOUND);
        }
        if (ConversationStatus.READONLY.getCode().equals(conversation.getStatus())) {
            return;
        }
        conversation.setStatus(ConversationStatus.READONLY.getCode());
        updateById(conversation);
        sendSystemMessage(conversationId, "溝通室已轉為唯讀模式。");
        log.info("溝通室轉唯讀: conversationId={}", conversationId);
    }

    @Override
    @Transactional
    public void setReadonlyForOrder(Long orderId) {
        for (Conversation conv : getOrderConversations(orderId)) {
            setReadonly(conv.getId());
        }
    }

    @Override
    @Transactional
    public void reopen(Long conversationId) {
        Conversation conversation = getById(conversationId);
        if (conversation == null) {
            throw new ServiceException(ResultCode.CONVERSATION_NOT_FOUND);
        }
        conversation.setStatus(ConversationStatus.OPEN.getCode());
        updateById(conversation);
        sendSystemMessage(conversationId, "爭議處理中，營運人員已介入，溝通室重新開啟。");
        log.info("溝通室重新開啟: conversationId={}", conversationId);
    }

    @Override
    @Transactional
    public void reopenForOrder(Long orderId) {
        for (Conversation conv : getOrderConversations(orderId)) {
            reopen(conv.getId());
        }
    }

    @Override
    public List<Message> getMessages(Long conversationId, int page, int size) {
        Page<Message> pageResult = messageMapper.selectPage(
                new Page<>(page, size),
                new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conversationId)
                        .orderByAsc(Message::getCreatedAt));
        return pageResult.getRecords();
    }

    @Override
    @Transactional
    public Message sendTextMessage(Long conversationId, Long senderId, String role, String content) {
        Conversation conversation = requireWritableConversation(conversationId);
        verifySenderAccess(conversation, senderId, role);

        String maskedContent = maskSensitiveInfo(content);
        Message message = buildMessage(conversationId, senderId, MessageType.TEXT.getCode(), maskedContent, null);
        messageMapper.insert(message);
        touchConversation(conversation);
        eventHub.publish(conversationId, "message", message);
        return message;
    }

    @Override
    @Transactional
    public Message sendImageMessage(Long conversationId, Long senderId, String role, String imageUrl) {
        Conversation conversation = requireWritableConversation(conversationId);
        verifySenderAccess(conversation, senderId, role);

        Message message = buildMessage(conversationId, senderId, MessageType.IMAGE.getCode(), null, imageUrl);
        messageMapper.insert(message);
        touchConversation(conversation);
        eventHub.publish(conversationId, "message", message);
        return message;
    }

    @Override
    @Transactional
    public Message sendSystemMessage(Long conversationId, String content) {
        Message message = buildMessage(conversationId, 0L, MessageType.SYSTEM.getCode(), content, null);
        messageMapper.insert(message);
        touchConversation(getById(conversationId));
        return message;
    }

    @Override
    @Transactional
    public void markAsRead(Long conversationId, Long userId, String role) {
        Conversation conv = getById(conversationId);
        if (conv == null) return;

        var wrapper = new com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper<Message>()
                .eq(Message::getConversationId, conversationId)
                .eq(Message::getIsRead, false)
                .ne(Message::getSenderId, userId)
                .set(Message::getIsRead, true)
                .set(Message::getReadAt, LocalDateTime.now());

        // 站方在客服/管理通道中只標記對方（非站方）發的訊息
        if (isStaffRole(role)
                && (ConversationType.CUSTOMER_SERVICE.getCode().equals(conv.getConversationType())
                || ConversationType.ADMIN.getCode().equals(conv.getConversationType()))) {
            wrapper.ne(Message::getSenderId, AppConstant.PLATFORM_USER_ID);
        }
        messageMapper.update(null, wrapper);
    }

    @Override
    @Transactional
    public List<Message> accessMessages(Long conversationId, Long accessorId, String reason) {
        ConversationAccessLog logEntry = new ConversationAccessLog();
        logEntry.setConversationId(conversationId);
        logEntry.setAccessorId(accessorId);
        logEntry.setReason(reason);
        accessLogMapper.insert(logEntry);

        log.info("溝通記錄調閱: conversationId={}, accessorId={}, reason={}",
                conversationId, accessorId, reason);

        return messageMapper.selectList(
                new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conversationId)
                        .orderByAsc(Message::getCreatedAt));
    }

    @Override
    public List<ConversationAccessLog> getAccessLogs(Long conversationId) {
        return accessLogMapper.selectList(
                new LambdaQueryWrapper<ConversationAccessLog>()
                        .eq(ConversationAccessLog::getConversationId, conversationId)
                        .orderByDesc(ConversationAccessLog::getAccessedAt));
    }

    // ── 參與者管理 ──

    @Override
    public boolean isActiveParticipant(Long conversationId, Long userId) {
        Long count = participantMapper.selectCount(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getUserId, userId)
                        .eq(ConversationParticipant::getIsActive, true)
        );
        return count != null && count > 0;
    }

    @Override
    @Transactional
    public ConversationParticipant addParticipant(Long conversationId, Long userId, String userType) {
        return addParticipantInternal(conversationId, userId, userType, false);
    }

    private ConversationParticipant addParticipantInternal(Long conversationId, Long userId, String userType, boolean silent) {
        // 檢查是否已存在（可能之前被移除，現在重新加入）
        ConversationParticipant existing = participantMapper.selectOne(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getUserId, userId)
        );

        if (existing != null) {
            if (Boolean.TRUE.equals(existing.getIsActive())) {
                return existing; // 已在對話中
            }
            // 重新啟用
            existing.setIsActive(true);
            existing.setRemovedAt(null);
            existing.setRemovedBy(null);
            participantMapper.updateById(existing);

            if (!silent) {
                User user = userMapper.selectById(userId);
                sendSystemMessage(conversationId,
                        String.format("%s %s 已重新加入對話", userType, user != null ? user.getUsername() : ""));
            }
            return existing;
        }

        // 全新加入
        ConversationParticipant participant = new ConversationParticipant();
        participant.setConversationId(conversationId);
        participant.setUserId(userId);
        participant.setUserType(userType);
        participant.setIsActive(true);
        participant.setJoinedAt(LocalDateTime.now());
        participantMapper.insert(participant);

        if (!silent) {
            User user = userMapper.selectById(userId);
            sendSystemMessage(conversationId,
                    String.format("%s %s 已加入對話", userType, user != null ? user.getUsername() : ""));
        }

        return participant;
    }

    private void addParticipantIfNotExists(Long conversationId, Long userId, String userType) {
        Long count = participantMapper.selectCount(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getUserId, userId)
                        .eq(ConversationParticipant::getIsActive, true)
        );
        if (count == null || count == 0) {
            addParticipant(conversationId, userId, userType);
        }
    }

    @Override
    @Transactional
    public void removeParticipant(Long conversationId, Long userId, Long removedBy) {
        ConversationParticipant participant = participantMapper.selectOne(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getUserId, userId)
                        .eq(ConversationParticipant::getIsActive, true)
        );

        if (participant == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "該使用者不在對話中");
        }

        // 不能移除消費者
        if ("CONSUMER".equals(participant.getUserType())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "不能移除訂單的消費者");
        }

        // 不能移除自己
        if (userId.equals(removedBy)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "不能移除自己");
        }

        // 軟刪除
        participant.setIsActive(false);
        participant.setRemovedAt(LocalDateTime.now());
        participant.setRemovedBy(removedBy);
        participantMapper.updateById(participant);

        User user = userMapper.selectById(userId);
        sendSystemMessage(conversationId,
                String.format("%s %s 已被站方移出對話", participant.getUserType(),
                        user != null ? user.getUsername() : ""));
    }

    @Override
    public List<ConversationParticipant> getParticipants(Long conversationId, boolean activeOnly) {
        LambdaQueryWrapper<ConversationParticipant> wrapper = new LambdaQueryWrapper<ConversationParticipant>()
                .eq(ConversationParticipant::getConversationId, conversationId);

        if (activeOnly) {
            wrapper.eq(ConversationParticipant::getIsActive, true);
        }

        return participantMapper.selectList(wrapper);
    }

    private Conversation requireWritableConversation(Long conversationId) {
        Conversation conversation = getById(conversationId);
        if (conversation == null) {
            throw new ServiceException(ResultCode.CONVERSATION_NOT_FOUND);
        }
        if (ConversationStatus.READONLY.getCode().equals(conversation.getStatus())) {
            throw new ServiceException(ResultCode.CONVERSATION_READONLY);
        }
        return conversation;
    }

    private void verifySenderAccess(Conversation conversation, Long senderId, String role) {
        if (isStaffRole(role)
                && (ConversationType.CUSTOMER_SERVICE.getCode().equals(conversation.getConversationType())
                || ConversationType.ADMIN.getCode().equals(conversation.getConversationType()))) {
            return;
        }
        // 查 participant 表，確認 senderId 是活躍參與者
        if (!isActiveParticipant(conversation.getId(), senderId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此溝通室的參與者或已被移除");
        }
    }

    private void touchConversation(Conversation conversation) {
        if (conversation == null) return;
        conversation.setModifiedAt(LocalDateTime.now());
        updateById(conversation);
    }

    private Message buildMessage(Long conversationId, Long senderId, String type, String content, String imageUrl) {
        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setMessageType(type);
        message.setContent(content);
        message.setImageUrl(imageUrl);
        message.setIsRead(false);
        return message;
    }

    private List<ConversationSummaryDto> toSummaries(List<Conversation> conversations, Long viewerId, String role) {
        List<ConversationSummaryDto> result = new ArrayList<>();
        for (Conversation conv : conversations) {
            ConversationSummaryDto dto = new ConversationSummaryDto();
            dto.setId(conv.getId());
            dto.setConversationType(conv.getConversationType());
            dto.setOrderId(conv.getOrderId());
            dto.setStatus(conv.getStatus());
            dto.setParticipantAId(conv.getParticipantAId());
            dto.setParticipantBId(conv.getParticipantBId());
            dto.setModifiedAt(conv.getModifiedAt());
            dto.setPeerName(resolvePeerName(conv, viewerId, role));

            Message last = messageMapper.selectOne(new LambdaQueryWrapper<Message>()
                    .eq(Message::getConversationId, conv.getId())
                    .orderByDesc(Message::getCreatedAt)
                    .last("LIMIT 1"));
            if (last != null) {
                dto.setLastMessage(formatPreview(last));
                dto.setLastMessageAt(last.getCreatedAt());
            }

            Long unreadCount;
            if (isStaffRole(role)
                    && (ConversationType.CUSTOMER_SERVICE.getCode().equals(conv.getConversationType())
                    || ConversationType.ADMIN.getCode().equals(conv.getConversationType()))) {
                // 站方未讀數：非站方發送的未讀訊息
                unreadCount = messageMapper.selectCount(new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conv.getId())
                        .ne(Message::getSenderId, AppConstant.PLATFORM_USER_ID)
                        .eq(Message::getIsRead, false));
            } else {
                unreadCount = messageMapper.selectCount(new LambdaQueryWrapper<Message>()
                        .eq(Message::getConversationId, conv.getId())
                        .ne(Message::getSenderId, viewerId)
                        .eq(Message::getIsRead, false));
            }
            dto.setUnreadCount(unreadCount != null ? unreadCount.intValue() : 0);
            result.add(dto);
        }
        return result;
    }

    private String resolvePeerName(Conversation conv, Long viewerId, String role) {
        if (ConversationType.CUSTOMER_SERVICE.getCode().equals(conv.getConversationType())) {
            if (isStaffRole(role)) {
                // 站方看客服通道：顯示消費者名稱
                return resolveParticipantName(conv.getId(), viewerId, role, "CONSUMER");
            }
            return "WanderLens 客服";
        }
        if (ConversationType.ADMIN.getCode().equals(conv.getConversationType())) {
            if (isStaffRole(role)) {
                // 站方看管理通道：顯示供給方名稱
                return resolveParticipantName(conv.getId(), viewerId, role, null);
            }
            return "WanderLens 平台";
        }
        // ORDER 類型：從 participant 表找其他活躍參與者名稱
        return resolveOrderPeerName(conv.getId(), viewerId, conv.getOrderId());
    }

    /**
     * 從 participant 表找指定類型的參與者名稱
     */
    private String resolveParticipantName(Long conversationId, Long viewerId, String role, String userTypeFilter) {
        LambdaQueryWrapper<ConversationParticipant> wrapper = new LambdaQueryWrapper<ConversationParticipant>()
                .eq(ConversationParticipant::getConversationId, conversationId)
                .eq(ConversationParticipant::getIsActive, true)
                .ne(ConversationParticipant::getUserId, viewerId);
        if (userTypeFilter != null) {
            wrapper.eq(ConversationParticipant::getUserType, userTypeFilter);
        }
        List<ConversationParticipant> participants = participantMapper.selectList(wrapper);
        if (participants.isEmpty()) return "未知";
        User user = userMapper.selectById(participants.get(0).getUserId());
        return user != null ? user.getUsername() : "用戶" + participants.get(0).getUserId();
    }

    /**
     * ORDER 類型對話：找其他活躍參與者名稱，多人時用「、」串連
     */
    private String resolveOrderPeerName(Long conversationId, Long viewerId, Long orderId) {
        List<ConversationParticipant> others = participantMapper.selectList(
                new LambdaQueryWrapper<ConversationParticipant>()
                        .eq(ConversationParticipant::getConversationId, conversationId)
                        .eq(ConversationParticipant::getIsActive, true)
                        .ne(ConversationParticipant::getUserId, viewerId)
                        .ne(ConversationParticipant::getUserId, AppConstant.PLATFORM_USER_ID)
        );
        if (others.isEmpty()) {
            return orderId != null ? "訂單 #" + orderId : "溝通室";
        }
        List<String> names = new ArrayList<>();
        for (ConversationParticipant p : others) {
            User user = userMapper.selectById(p.getUserId());
            names.add(user != null ? user.getUsername() : "用戶" + p.getUserId());
        }
        return String.join("、", names);
    }

    private String formatPreview(Message msg) {
        if (MessageType.IMAGE.getCode().equals(msg.getMessageType())) return "[圖片]";
        if (MessageType.SYSTEM.getCode().equals(msg.getMessageType())) return msg.getContent();
        return msg.getContent();
    }

    private boolean isStaffRole(String role) {
        return "ADMIN".equals(role) || "SUPPORT".equals(role);
    }

    private String maskSensitiveInfo(String content) {
        if (content == null || content.isEmpty()) return content;
        String masked = PHONE_PATTERN.matcher(content).replaceAll(match -> {
            String phone = match.group();
            if (phone.length() >= 6) {
                return phone.substring(0, 4) + "****" + phone.substring(phone.length() - 2);
            }
            return "****";
        });
        masked = EMAIL_PATTERN.matcher(masked).replaceAll(match -> {
            String email = match.group();
            int atIndex = email.indexOf('@');
            if (atIndex > 1) {
                return email.charAt(0) + "***" + email.substring(atIndex);
            }
            return "****";
        });
        return masked;
    }
}
