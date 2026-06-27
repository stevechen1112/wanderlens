package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 *
 * @TableName service_category_lang
 */
@TableName(value ="service_category_lang")
@Data
public class ServiceCategoryLang implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 服務id
     */
    private Integer serviceCategoryId;

    /**
     * 標題
     */
    private String name;

    /**
     * 服務簡介
     */
    private String description;

    /**
     * 語系
     */
    private String lang;

    /**
     * 建立時間
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 修改時間
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date modifiedAt;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
