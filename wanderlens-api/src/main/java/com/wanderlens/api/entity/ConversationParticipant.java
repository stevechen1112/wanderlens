package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 對話參與者 Entity
 * 對應資料表: conversation_participant
 *
 * 支援多人對話：一個 conversation 可有多個 participant。
 * is_active = false 表示已被站方移除（軟刪除）。
 */
@Data
@TableName("conversation_participant")
public class ConversationParticipant {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long conversationId;

    private Long userId;

    /** CONSUMER / PHOTOGRAPHER / STYLIST */
    private String userType;

    /** true = 在對話中, false = 已被移除 */
    private Boolean isActive;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime joinedAt;

    /** 被移除時間（isActive = false 時填入） */
    private LocalDateTime removedAt;

    /** 移除者 ID（站方 user_id） */
    private Long removedBy;
}