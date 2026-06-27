package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 帳號狀態
 */
@Getter
public enum UserStatus {
    ACTIVE("ACTIVE", "啟用"),
    SUSPENDED("SUSPENDED", "停用"),
    DELETED("DELETED", "已刪除");

    private final String code;
    private final String label;

    UserStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }
}