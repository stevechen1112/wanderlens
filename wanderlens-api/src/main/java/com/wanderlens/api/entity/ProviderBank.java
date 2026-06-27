package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方匯款資料 Entity
 * 對應資料表: provider_bank
 */
@Data
@TableName("provider_bank")
public class ProviderBank {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    private String bankCode;
    private String bankName;
    private String bankBranch;
    private String accountName;
    private String accountNo;
    private String note;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}