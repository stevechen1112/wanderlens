package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 溝通室 Entity
 * 對應資料表: conversation
 *
 * 三條通道：
 * - ADMIN: 站方 ↔ 攝影師/造型師（管理通道）
 * - CUSTOMER_SERVICE: 站方 ↔ 消費者（客服通道）
 * - ORDER: 消費者 ↔ 攝影師/造型師（訂單通道，僅成交後開啟）
 */
@Data
@TableName("conversation")
public class Conversation {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** ADMIN / CUSTOMER_SERVICE / ORDER */
    private String conversationType;

    /** 關聯訂單 ID（ORDER 類型） */
    private Long orderId;

    /** 參與者 A（消費者或站方） */
    private Long participantAId;

    /** 參與者 B（攝影師/造型師或消費者） */
    private Long participantBId;

    /** OPEN / READONLY / CLOSED */
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}