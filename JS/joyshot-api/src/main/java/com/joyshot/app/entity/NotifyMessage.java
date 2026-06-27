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
 * @TableName notify_message
 */
@TableName(value ="notify_message")
@Data
public class NotifyMessage implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 訊息接收人
     */
    private Integer messageOwner;

    /**
     * 訊息
     */
    private String message;

    /**
     * 訊息點擊後前往
     */
    private String messageUrl;

    /**
     * 已讀/未讀
     */
    private String isRead;

    /**
     * 訊息產生時間
     */
    private Date createdAt;

    /**
     * 訊息更新時間
     */
    private Date updatedAt;

    /**
     * 與哪個待辦關聯
     */
    private Integer todoId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}