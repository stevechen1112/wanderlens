package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 使用者 Entity
 * 對應資料表: user
 */
@Data
@TableName("user")
public class User {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 登入帳號（手機號碼或 Email） */
    private String empno;

    /** 密碼（BCrypt 加密） */
    private String password;

    /** 姓名 */
    private String username;

    /** 電話 */
    private String phone;

    /** Email */
    private String email;

    /** 大頭照 URL */
    private String avatar;

    /** 角色（CONSUMER/PHOTOGRAPHER/STYLIST/STUDIO_MANAGER/ADMIN/SUPPORT/FINANCE/RETOUCH_COMPANY） */
    private String role;

    /** 角色 ID（RBAC 關聯） */
    private Long roleId;

    /** 所在區域 */
    private String area;

    /** 關聯 Provider ID（如適用） */
    private Long providerId;

    /** 關聯推廣員 ID（如適用） */
    private Long affiliateId;

    /** LINE Notify token */
    private String lineToken;

    /** LINE OAuth 授權碼 */
    private String lineAuthCode;

    /** LINE Messaging API userId */
    private String lineUserId;

    /** 帳號狀態（ACTIVE/SUSPENDED/DELETED） */
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}