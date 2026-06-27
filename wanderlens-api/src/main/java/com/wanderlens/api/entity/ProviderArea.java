package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方服務地區 Entity
 * 對應資料表: provider_area
 */
@Data
@TableName("provider_area")
public class ProviderArea {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    private Long areaParentId;

    private Long areaId;

    private String zipCode;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}