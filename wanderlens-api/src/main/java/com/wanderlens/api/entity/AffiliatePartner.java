package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("affiliate_partner")
public class AffiliatePartner {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String empno;
    private String phone;
    private String referralCode;
    private String bankAccount;
    private BigDecimal commissionRate;
    private Integer clickCount;
    private Integer conversionCount;
    private Integer totalCommission;
    private String status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}
