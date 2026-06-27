package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 媒體資產狀態
 */
@Getter
public enum AssetStatus {
    UPLOADING("UPLOADING", "上傳中"),
    UPLOADED("UPLOADED", "已上傳"),
    PROCESSING("PROCESSING", "處理中"),
    READY("READY", "就緒"),
    FAILED("FAILED", "失敗");

    private final String code;
    private final String label;

    AssetStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }
}