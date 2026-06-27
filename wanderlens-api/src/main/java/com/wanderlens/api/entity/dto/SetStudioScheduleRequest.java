package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SetStudioScheduleRequest {
    @NotNull
    private Long studioId;
    @NotNull
    private java.util.List<String> dates;
    @NotNull
    private String slotStart;
    @NotNull
    private String slotEnd;
}
