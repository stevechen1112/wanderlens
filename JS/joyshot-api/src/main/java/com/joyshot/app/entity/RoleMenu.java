package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;

import lombok.Data;

/**
 * @TableName role_menu
 */
@TableName(value = "role_menu")
@Data
public class RoleMenu implements Serializable {
    /**
     * 角色id
     */

    private Integer roleId;

    /**
     * 選單id
     */

    private Integer menuId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
