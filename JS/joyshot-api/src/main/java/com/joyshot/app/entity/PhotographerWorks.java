package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName photographer_works
 */
@TableName(value ="photographer_works")
@Data
public class PhotographerWorks implements Serializable {
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
     * 作品檔id
     */
    private String fileUuid;

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
