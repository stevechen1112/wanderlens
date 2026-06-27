package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;

import lombok.Data;

/**
 * @TableName role
 */
@TableName(value = "role")
@Data
public class Role implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 角色名
     */
    private String name;

    /**
     * 英文名
     */
    private String engName;

    /**
     * 描述
     */
    private String description;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
