package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 拍攝類型 Entity
 * 對應資料表: service_type
 */
@Data
@TableName("service_type")
public class ServiceType {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String nameEn;
    private String nameJp;
    private String nameKr;

    /** 圖示 URL */
    private String iconUrl;

    /** 建議配置（JSON：{shootLocation, photographerCount, needStylist}） */
    private String suggestedConfig;

    private Integer sortOrder;

    /** Y/N */
    private String active;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}