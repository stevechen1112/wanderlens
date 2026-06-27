package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 站內通知訊息 Entity
 * 對應資料表: notify_message
 */
@Data
@TableName("notify_message")
public class NotifyMessage {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 通知擁有者 ID */
    private Long messageOwner;

    /** 通知內容 */
    private String message;

    /** 通知連結 URL */
    private String messageUrl;

    /** 是否已讀 */
    private Boolean isRead;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}