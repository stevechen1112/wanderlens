package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName photographer_rating
 */
@TableName(value ="photographer_rating")
@Data
public class PhotographerRating implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 攝影師id
     */
    private Integer phId;

    /**
     * 評論
     */
    private String comments;

    /**
     * 留言者
     */
    private String author;

    /**
     * 顆星
     */
    private Integer stars;

    /**
     * 評論人員
     */
    private String createdBy;

    /**
     * 建立時間
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 更新時間
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
