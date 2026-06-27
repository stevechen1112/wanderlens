package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 攝影棚檔期 Entity
 * 對應資料表: studio_availability
 */
@Data
@TableName("studio_availability")
public class StudioAvailability {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long studioId;

    private java.time.LocalDate scheduleDate;

    private java.time.LocalTime slotStart;
    private java.time.LocalTime slotEnd;

    /** Y/N */
    private String active;

    /** 被訂單鎖定時的訂單 ID */
    private Long lockedByOrderId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}