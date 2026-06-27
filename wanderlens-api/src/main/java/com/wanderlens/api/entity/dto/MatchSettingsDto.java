package com.wanderlens.api.entity.dto;

import lombok.Data;

import java.util.List;

@Data
public class MatchSettingsDto {
    private List<Long> serviceTypeIds;
    private Double maxDistanceKm = 20.0;
    private Integer minDurationMinutes = 30;
    private Integer maxDurationMinutes = 240;
}
