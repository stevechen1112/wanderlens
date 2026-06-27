package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName photographer_feature
 */
@TableName(value ="photographer_feature")
@Data
public class PhotographerFeature implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 語系
     */
    private String language;

    /**
     * 攝影師id
     */
    private Integer phId;

    /**
     * 特色標題
     */
    private String featureTitle;

    /**
     * 特色內容
     */
    private String featureContent;

    /**
     * 是否啟用
     */
    private Integer enable;

    /**
     * 顯示排序
     */
    private Integer sort;

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
