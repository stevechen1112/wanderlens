package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class RecallItemDto {
    /** ANNIVERSARY | BABY_MONTH | TRAVEL */
    private String type;
    private String title;
    private String subtitle;
    private Long orderId;
    private Long albumId;
    private LocalDate shootingDate;
    private String shootingLocation;
    private String coverUrl;
    private String actionLabel;
}
