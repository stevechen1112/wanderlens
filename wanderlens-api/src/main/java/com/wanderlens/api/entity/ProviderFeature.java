package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方特色資料 Entity（多語系）
 * 對應資料表: provider_feature
 */
@Data
@TableName("provider_feature")
public class ProviderFeature {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    /** 語系（tw/en/jp/kr） */
    private String language;

    private String featureType;

    private String featureTitle;

    private String featureContent;

    /** Y/N */
    private String enable;

    private Integer sort;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}