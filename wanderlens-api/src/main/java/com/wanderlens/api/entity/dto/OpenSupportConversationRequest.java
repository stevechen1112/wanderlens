package com.wanderlens.api.entity.dto;

import lombok.Data;

@Data
public class OpenSupportConversationRequest {
    /** 目標使用者 ID（客服通道=消費者，管理通道=供給方） */
    private Long targetUserId;
    private String initialMessage;
}
