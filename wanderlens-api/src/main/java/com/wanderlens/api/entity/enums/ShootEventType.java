package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 拍攝事件類型
 */
@Getter
public enum ShootEventType {
    SHOOT_START("SHOOT_START", "起拍"),
    SHOOT_END("SHOOT_END", "結束拍攝"),
    EXTRA_TIME_REQUEST("EXTRA_TIME_REQUEST", "加時申請"),
    EXTRA_TIME_CONFIRMED("EXTRA_TIME_CONFIRMED", "加時確認"),
    EXTRA_TIME_REJECTED("EXTRA_TIME_REJECTED", "加時拒絕");

    private final String code;
    private final String label;

    ShootEventType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}