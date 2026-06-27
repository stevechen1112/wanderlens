package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MatchRequestDto {
    private Long id;
    private String status;
    private String shootingLocation;
    private Double shootingLat;
    private Double shootingLng;
    private BigDecimal durationHours;
    private LocalDateTime scheduledTime;
    private Integer estimatedFee;
    private Integer radiusKm;
    private Integer broadcastRound;
    private Integer elapsedSeconds;
    private MatchedProvider matchedProvider;
    private Long orderId;
    private List<FallbackProvider> fallbackProviders;

    @Data
    @Builder
    public static class MatchedProvider {
        private Long providerId;
        private String nickName;
        private String avatar;
        private Double rating;
        private Double distanceKm;
        private Integer estimatedFee;
    }

    @Data
    @Builder
    public static class FallbackProvider {
        private Long providerId;
        private String nickName;
        private Double rating;
        private Double distanceKm;
        private Integer unitPrice;
    }
}
