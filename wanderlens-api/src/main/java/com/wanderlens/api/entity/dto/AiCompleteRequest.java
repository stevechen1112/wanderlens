package com.wanderlens.api.entity.dto;

import lombok.Data;

import java.util.List;

@Data
public class AiCompleteRequest {
    private Long orderId;
    private List<String> assetUrls;
}
