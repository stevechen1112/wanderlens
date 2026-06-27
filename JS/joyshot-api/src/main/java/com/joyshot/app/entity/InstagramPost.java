package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 
 * @TableName instagram_post
 */
@TableName(value ="instagram_post")
@Data
public class InstagramPost implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 照片
     */
    private String igImageUuid;

    /**
     * IG貼文網址
     */
    private String igUrl;

    /**
     * 標題
     */
    private String title;

    /**
     * 建立時間
     */
    private Date createdAt;

    /**
     * 修改時間
     */
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}