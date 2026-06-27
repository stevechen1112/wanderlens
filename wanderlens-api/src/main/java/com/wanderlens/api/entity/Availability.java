package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方行事曆 Entity
 * 對應資料表: availability
 */
@Data
@TableName("availability")
public class Availability {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    private java.time.LocalDate scheduleDate;

    private java.time.LocalTime slotStart;

    private java.time.LocalTime slotEnd;

    /** 前置緩衝（分鐘，造型師用） */
    private Integer bufferBefore;

    /** 可預約數 */
    private Integer maxValue;

    /** Y/N */
    private String active;

    /** 被訂單鎖定時的訂單 ID */
    private Long lockedByOrderId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}