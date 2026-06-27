package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 溝通室類型
 */
@Getter
public enum ConversationType {
    ADMIN("ADMIN", "管理通道（站方↔攝影師/造型師）"),
    CUSTOMER_SERVICE("CUSTOMER_SERVICE", "客服通道（站方↔消費者）"),
    ORDER("ORDER", "訂單通道（消費者↔攝影師/造型師）");

    private final String code;
    private final String label;

    ConversationType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}