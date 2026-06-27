package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * @author avery
 * @TableName action_log
 */
@TableName(value = "action_log")
@Data
public class ActionLog implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 使用者
     */
    private Integer userId;

    /**
     * 動作
     */
    private String action;

    /**
     * 時間
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm", timezone = "GMT+8")
    private Date createdAt;

    /**
     * ip
     */
    private String ip;

    /**
     * browser
     */
    private String browser;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
