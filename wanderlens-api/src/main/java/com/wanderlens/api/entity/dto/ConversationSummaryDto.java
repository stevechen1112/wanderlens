package com.wanderlens.api.entity.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ConversationSummaryDto {
    private Long id;
    private String conversationType;
    private Long orderId;
    private String status;
    private Long participantAId;
    private Long participantBId;
    /** 對方顯示名稱 */
    private String peerName;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private LocalDateTime modifiedAt;
}
