package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

/**
 * 拍攝配置 Entity
 * 對應資料表: configuration
 */
@Data
@TableName("configuration")
public class Configuration {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** OUTDOOR / STUDIO / BOTH */
    private String shootLocation;

    /** 1 或 2 */
    private Integer photographerCount;

    /** 是否需要造型師 */
    private Boolean needStylist;

    /** 配置標籤 */
    private String label;
}