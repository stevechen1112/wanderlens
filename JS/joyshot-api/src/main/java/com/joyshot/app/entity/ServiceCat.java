package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @author avery
 * @TableName service_cat
 */
@TableName(value ="service_cat")
@Data
public class ServiceCat implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 服務名稱
     */
    private String name;
    private String nameEn;
    private String nameJp;
    private String nameKr;

    /**
     * 代表圖
     */
    private String fileUuid;

    /**
     * icon圖
     */
    private String iconFileUuid;

    /**
     * 價格
     */
    private Integer price;

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
    private FileRepo featureFile;

    @TableField(exist = false)
    private FileRepo iconFile;



    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
