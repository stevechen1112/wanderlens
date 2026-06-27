package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 供給方類型
 */
@Getter
public enum ProviderType {
    PHOTOGRAPHER("PHOTOGRAPHER", "攝影師"),
    STYLIST("STYLIST", "造型師"),
    STUDIO("STUDIO", "攝影棚");

    private final String code;
    private final String label;

    ProviderType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}