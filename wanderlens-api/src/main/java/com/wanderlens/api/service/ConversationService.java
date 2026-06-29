package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Conversation;
import com.wanderlens.api.entity.ConversationAccessLog;
import com.wanderlens.api.entity.ConversationParticipant;
import com.wanderlens.api.entity.Message;
import com.wanderlens.api.entity.dto.ConversationSummaryDto;

import java.util.List;

public interface ConversationService extends IService<Conversation> {

    List<ConversationSummaryDto> getMyConversationSummaries(Long userId, String role);

    List<ConversationSummaryDto> getSupportConversationSummaries();

    Conversation getOrderConversation(Long orderId, Long providerId);

    List<Conversation> getOrderConversations(Long orderId);

    // 簽名變更：支援多 participant
    Conversation openOrderConversation(Long orderId, List<Long> participantIds, List<String> userTypes);

    Conversation openCustomerServiceConversation(Long consumerId, String initialMessage);

    Conversation openAdminConversation(Long providerId);

    void setReadonly(Long conversationId);

    void setReadonlyForOrder(Long orderId);

    void reopen(Long conversationId);

    void reopenForOrder(Long orderId);

    List<Message> getMessages(Long conversationId, int page, int size);

    Message sendTextMessage(Long conversationId, Long senderId, String role, String content);

    Message sendImageMessage(Long conversationId, Long senderId, String role, String imageUrl);

    Message sendSystemMessage(Long conversationId, String content);

    void markAsRead(Long conversationId, Long userId, String role);

    List<Message> accessMessages(Long conversationId, Long accessorId, String reason);

    List<ConversationAccessLog> getAccessLogs(Long conversationId);

    // ── 新增：參與者管理 ──

    /** 檢查 userId 是否為對話的活躍參與者 */
    boolean isActiveParticipant(Long conversationId, Long userId);

    /** 新增參與者（若已存在且被移除則重新啟用） */
    ConversationParticipant addParticipant(Long conversationId, Long userId, String userType);

    /** 移除參與者（軟刪除，不能移除消費者） */
    void removeParticipant(Long conversationId, Long userId, Long removedBy);

    /** 取得參與者列表 */
    List<ConversationParticipant> getParticipants(Long conversationId, boolean activeOnly);
}
