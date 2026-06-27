package com.wanderlens.api.entity.dto;

import lombok.Data;

@Data
public class MatchOnlineRequest {
    private Double lat;
    private Double lng;
    private String city;
}
