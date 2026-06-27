package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 行為事件類型
 */
@Getter
public enum BehaviorEventType {
    ALBUM_VIEWED("ALBUM_VIEWED", "相簿瀏覽"),
    PHOTO_DOWNLOADED("PHOTO_DOWNLOADED", "照片下載"),
    PHOTO_SHARED("PHOTO_SHARED", "照片分享"),
    PHOTO_FAVORITED("PHOTO_FAVORITED", "照片收藏"),
    PHOTO_MADE_PUBLIC("PHOTO_MADE_PUBLIC", "設為公開"),
    PUBLIC_PAGE_VIEWED("PUBLIC_PAGE_VIEWED", "公開頁瀏覽"),
    BOOKING_STARTED_FROM_CONTENT("BOOKING_STARTED_FROM_CONTENT", "從內容開始預約"),
    RETOUCH_SELECTED("RETOUCH_SELECTED", "精修選片"),
    PHOTOGRAPHER_VIEWED("PHOTOGRAPHER_VIEWED", "攝影師頁瀏覽"),
    LOCATION_VIEWED("LOCATION_VIEWED", "地點頁瀏覽"),
    REFERRAL_CLICKED("REFERRAL_CLICKED", "推薦連結點擊");

    private final String code;
    private final String label;

    BehaviorEventType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}