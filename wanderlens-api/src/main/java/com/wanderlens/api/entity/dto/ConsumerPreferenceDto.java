package com.wanderlens.api.entity.dto;

import lombok.Data;

import java.util.List;

@Data
public class ConsumerPreferenceDto {
    private List<Long> preferredServiceTypeIds;
    private List<String> preferredCities;
    private Integer budgetMin;
    private Integer budgetMax;
    private Boolean pushRecallEnabled;
}
