package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 訊息 Entity
 * 對應資料表: message
 */
@Data
@TableName("message")
public class Message {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long conversationId;

    /** 發送者 ID */
    private Long senderId;

    /** TEXT / IMAGE / SYSTEM / TEMPLATE */
    private String messageType;

    /** 訊息內容（文字或系統訊息） */
    private String content;

    /** 圖片 URL（IMAGE 類型） */
    private String imageUrl;

    /** 是否已讀 */
    private Boolean isRead;

    /** 已讀時間 */
    private LocalDateTime readAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}