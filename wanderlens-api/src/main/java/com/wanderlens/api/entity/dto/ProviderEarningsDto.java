package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProviderEarningsDto {
    private Integer monthlyEarnings;
    private Integer totalEarnings;
    private Integer pendingSettlement;
    private Integer withdrawable;
    private List<EarningItemDto> items;

    @Data
    @Builder
    public static class EarningItemDto {
        private Long orderId;
        private String orderNo;
        private String status;
        private String shootingDate;
        private Integer amount;
        private boolean settled;
    }
}
