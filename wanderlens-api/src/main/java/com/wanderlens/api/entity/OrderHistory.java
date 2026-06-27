package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 訂單歷程 Entity（每次狀態變更記錄）
 * 對應資料表: order_history
 */
@Data
@TableName("order_history")
public class OrderHistory {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    private String orderNo;

    /** 原狀態 */
    private String fromStatus;

    /** 新狀態 */
    private String toStatus;

    /** 動作 */
    private String action;

    /** 詳細說明 */
    private String actionDetail;

    /** 執行者 */
    private String execBy;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}