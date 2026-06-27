package com.wanderlens.api.entity.enums;

import lombok.Getter;

/**
 * 清算帳本分錄類型
 */
@Getter
public enum LedgerEntryType {
    RECEIPT("RECEIPT", "收款"),
    PLATFORM_FEE("PLATFORM_FEE", "平台抽成"),
    PROVIDER_PAYABLE("PROVIDER_PAYABLE", "攝影師應付"),
    STUDIO_PAYABLE("STUDIO_PAYABLE", "攝影棚應付"),
    STYLIST_PAYABLE("STYLIST_PAYABLE", "造型師應付"),
    RETOUCH_PAYABLE("RETOUCH_PAYABLE", "外包修圖應付"),
    PAYOUT("PAYOUT", "實際撥款");

    private final String code;
    private final String label;

    LedgerEntryType(String code, String label) {
        this.code = code;
        this.label = label;
    }
}