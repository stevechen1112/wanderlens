package com.wanderlens.api.entity.enums;

import lombok.Getter;

@Getter
public enum MatchRequestStatus {
    SEARCHING("SEARCHING", "搜尋中"),
    MATCH_FOUND("MATCH_FOUND", "已找到攝影師"),
    PAYMENT_PENDING("PAYMENT_PENDING", "待付款"),
    EXPIRED("EXPIRED", "已逾時"),
    FALLBACK("FALLBACK", "降級搜尋"),
    CANCELLED("CANCELLED", "已取消");

    private final String code;
    private final String label;

    MatchRequestStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }
}
