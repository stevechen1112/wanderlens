package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName line_message
 */
@TableName(value ="line_message")
@Data
public class LineMessage implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 訊息
     */
    private String lineMessage;

    /**
     * 圖片
     */
    private String imageUuid;

    /**
     * 圖片
     */
    private String targetUser;



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
