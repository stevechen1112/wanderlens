package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @TableName menu
 */
@TableName(value = "menu")
@Data
public class Menu implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 選單名稱
     */
    private String name;

    /**
     * 路徑
     */
    private String path;

    /**
     * 圖示
     */
    private String icon;

    /**
     * 描述
     */
    private String description;

    /**
     * 日常常用
     */
    private String daily;

    private Integer parentId;

    @TableLogic
    private String isDeleted;

    @TableField(exist = false)
    private List<Menu> children;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
