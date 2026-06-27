package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.File;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName service_category
 */
@TableName(value ="service_category")
@Data
public class ServiceCategory implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

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

    /**
     * 資料建立人員
     */
    private Integer createdBy;

    /**
     * 代表圖id
     */
    private Integer fileId;



    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private ServiceCategoryLang lang;

    @TableField(exist = false)
    private FileRepo file;
}
