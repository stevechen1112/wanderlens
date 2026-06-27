package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 拍攝事件 Entity（起拍/加時/結束時間戳記）
 * 對應資料表: shoot_event
 */
@Data
@TableName("shoot_event")
public class ShootEvent {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    /** SHOOT_START / SHOOT_END / EXTRA_TIME_REQUEST / EXTRA_TIME_CONFIRMED / EXTRA_TIME_REJECTED */
    private String eventType;

    private LocalDateTime eventTime;

    /** 加時分鐘（如適用） */
    private Integer extraTimeMinutes;

    /** 加時費用（如適用） */
    private Integer extraTimeFee;

    /** 操作者 ID */
    private Long operatorId;
}