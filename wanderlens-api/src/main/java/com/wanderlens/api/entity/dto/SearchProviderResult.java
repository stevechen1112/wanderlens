package com.wanderlens.api.entity.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 搜尋結果 — 攝影師卡片 DTO
 */
@Data
public class SearchProviderResult {

    private Long providerId;
    private String providerUuid;
    private String nickName;
    private String city;
    private String avatar;
    private String bannerImg;
    private BigDecimal rating;
    private Integer ratingCount;

    /** 每小時單價 */
    private Integer unitPrice;

    /** 交通費 */
    private Integer transportationFee;

    /** 總費用 */
    private Integer totalFee;

    /** 是否可立即預約 */
    private Boolean available;

    /** 對應可用時段 ID（供建單鎖定） */
    private Long availabilityId;
}