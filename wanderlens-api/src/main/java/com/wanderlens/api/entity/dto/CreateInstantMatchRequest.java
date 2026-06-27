package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateInstantMatchRequest {

    @NotNull
    private Long serviceTypeId;

    @NotBlank
    private String shootingLocation;

    private Double shootingLat;
    private Double shootingLng;

    private String city;

    @NotNull
    private BigDecimal durationHours;

    /** 0=現在, 30=30分鐘後, 60=1小時後 */
    private Integer startOffsetMinutes = 0;

    private String customerName;
    private String customerPhone;
}
