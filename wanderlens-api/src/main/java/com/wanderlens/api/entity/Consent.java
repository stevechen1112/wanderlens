package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("consent")
public class Consent {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long mediaAssetId;
    private Long albumId;

    /** 消費者授權層級 */
    private String consumerConsent;

    /** 攝影師授權層級 */
    private String providerConsent;

    private Boolean consentByConsumer;
    private Boolean consentByProvider;

    /** 含未成年人 */
    private Boolean hasMinor;

    private LocalDateTime revokedAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}