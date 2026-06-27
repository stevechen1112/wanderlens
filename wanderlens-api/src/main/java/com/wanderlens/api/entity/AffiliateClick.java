package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("affiliate_click")
public class AffiliateClick {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long affiliateId;
    private String referralCode;
    private String sourceUrl;
    private String ipAddress;
    private String userAgent;
    private Boolean converted;
    private Long orderId;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
