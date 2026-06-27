package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 精修工單狀態
 */
@Getter
public enum RetouchJobStatus {
    REQUESTED("REQUESTED", "已申請"),
    ASSIGNED("ASSIGNED", "已派工"),
    IN_PROGRESS("IN_PROGRESS", "處理中"),
    DELIVERED("DELIVERED", "已交付"),
    REJECTED("REJECTED", "退修"),
    SETTLED("SETTLED", "已結算");

    private final String code;
    private final String label;

    RetouchJobStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }
}