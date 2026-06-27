package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 溝通調閱日誌 Entity
 * 對應資料表: conversation_access_log
 */
@Data
@TableName("conversation_access_log")
public class ConversationAccessLog {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long conversationId;

    /** 調閱者 ID */
    private Long accessorId;

    /** 調閱原因 */
    private String reason;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime accessedAt;
}