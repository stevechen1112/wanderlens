package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 溝通室狀態
 */
@Getter
public enum ConversationStatus {
    OPEN("OPEN", "開啟"),
    READONLY("READONLY", "唯讀"),
    CLOSED("CLOSED", "關閉");

    private final String code;
    private final String label;

    ConversationStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }
}