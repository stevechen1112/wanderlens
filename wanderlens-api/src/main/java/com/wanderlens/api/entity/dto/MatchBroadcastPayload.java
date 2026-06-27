package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchBroadcastPayload {
    private String type;
    private Long requestId;
    private Long serviceTypeId;
    private String shootingLocation;
    private Double shootingLat;
    private Double shootingLng;
    private BigDecimal durationHours;
    private LocalDateTime scheduledTime;
    private Integer estimatedIncome;
    private Double distanceKm;
    private Integer responseSeconds;
}
