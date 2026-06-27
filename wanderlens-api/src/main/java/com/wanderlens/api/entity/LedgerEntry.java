package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 清算帳本 Entity
 * 對應資料表: ledger_entry
 */
@Data
@TableName("ledger_entry")
public class LedgerEntry {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;

    /** RECEIPT / PLATFORM_FEE / PROVIDER_PAYABLE / STUDIO_PAYABLE / STYLIST_PAYABLE / RETOUCH_PAYABLE / PAYOUT */
    private String entryType;

    private Integer amount;

    /** 關聯供給方 ID */
    private Long providerId;

    /** PENDING / SETTLED */
    private String status;

    private LocalDateTime settledAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}