package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Conversation;
import com.wanderlens.api.entity.ConversationAccessLog;
import com.wanderlens.api.entity.Message;
import com.wanderlens.api.entity.dto.ConversationSummaryDto;

import java.util.List;

public interface ConversationService extends IService<Conversation> {

    List<ConversationSummaryDto> getMyConversationSummaries(Long userId, String role);

    List<ConversationSummaryDto> getSupportConversationSummaries();

    Conversation getOrderConversation(Long orderId, Long providerId);

    List<Conversation> getOrderConversations(Long orderId);

    Conversation openOrderConversation(Long orderId, Long consumerId, Long providerId);

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
}
