package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 使用者角色
 */
@Getter
public enum UserRole {
    CONSUMER("CONSUMER", "消費者"),
    PHOTOGRAPHER("PHOTOGRAPHER", "攝影師"),
    STYLIST("STYLIST", "造型師"),
    STUDIO_MANAGER("STUDIO_MANAGER", "攝影棚管理者"),
    ADMIN("ADMIN", "平台營運"),
    SUPPORT("SUPPORT", "客服"),
    FINANCE("FINANCE", "財務"),
    RETOUCH_COMPANY("RETOUCH_COMPANY", "外包修圖公司");

    private final String code;
    private final String label;

    UserRole(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public static UserRole fromCode(String code) {
        for (UserRole role : values()) {
            if (role.code.equals(code)) {
                return role;
            }
        }
        throw new IllegalArgumentException("未知角色: " + code);
    }
}