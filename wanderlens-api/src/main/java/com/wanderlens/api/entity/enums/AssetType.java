package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 媒體資產類型
 */
@Getter
public enum AssetType {
    RAW("RAW", "原始檔"),
    JPEG("JPEG", "機身 JPEG"),
    AI_BASIC("AI_BASIC", "AI 基本調色"),
    RETOUCH("RETOUCH", "精修成品");

    private final String code;
    private final String label;

    AssetType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}