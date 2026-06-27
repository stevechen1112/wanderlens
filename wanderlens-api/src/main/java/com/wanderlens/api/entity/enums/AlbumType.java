package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 相簿類型
 */
@Getter
public enum AlbumType {
    PRIVATE("PRIVATE", "私人相簿"),
    PUBLIC("PUBLIC", "公開相簿");

    private final String code;
    private final String label;

    AlbumType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}