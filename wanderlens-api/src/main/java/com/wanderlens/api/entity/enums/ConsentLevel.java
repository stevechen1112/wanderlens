package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 授權層級
 */
@Getter
public enum ConsentLevel {
    PRIVATE("PRIVATE", "私密"),
    LINK_SHARE("LINK_SHARE", "連結分享"),
    PUBLIC("PUBLIC", "平台公開"),
    PORTFOLIO("PORTFOLIO", "攝影師作品集"),
    MARKETING("MARKETING", "平台行銷"),
    COMMERCIAL("COMMERCIAL", "商業合作");

    private final String code;
    private final String label;

    ConsentLevel(String code, String label) {
        this.code = code;
        this.label = label;
    }
}