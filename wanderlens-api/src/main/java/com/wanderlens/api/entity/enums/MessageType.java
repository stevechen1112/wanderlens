package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 訊息類型
 */
@Getter
public enum MessageType {
    TEXT("TEXT", "文字"),
    IMAGE("IMAGE", "圖片"),
    SYSTEM("SYSTEM", "系統訊息"),
    TEMPLATE("TEMPLATE", "範本訊息");

    private final String code;
    private final String label;

    MessageType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}