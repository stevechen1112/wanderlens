package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 選單 Entity（RBAC 權限樹）
 * 對應資料表: menu
 */
@Data
@TableName("menu")
public class Menu {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 選單名稱 */
    private String name;

    /** 路由路徑 */
    private String path;

    /** 圖示 */
    private String icon;

    /** 說明 */
    private String description;

    /** 是否為每日使用（快捷選單） */
    private Boolean daily;

    /** 父選單 ID（null = 根節點） */
    private Long parentId;

    /** 排序 */
    private Integer sortOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}