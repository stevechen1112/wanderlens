package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmitRatingRequest {
    @NotNull
    private Long orderId;
    @NotNull
    private Long providerId;
    @NotNull
    @Min(1) @Max(5)
    private Integer stars;
    private String comments;
}
