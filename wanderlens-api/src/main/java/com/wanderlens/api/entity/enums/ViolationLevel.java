package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 違規等級（攝影師棄權懲罰機制）
 */
@Getter
public enum ViolationLevel {
    NONE("NONE", "無違規"),
    WARNING("WARNING", "警告"),
    SUSPENDED("SUSPENDED", "暫停接案"),
    PERMANENT_BAN("PERMANENT_BAN", "永久下架");

    private final String code;
    private final String label;

    ViolationLevel(String code, String label) {
        this.code = code;
        this.label = label;
    }
}