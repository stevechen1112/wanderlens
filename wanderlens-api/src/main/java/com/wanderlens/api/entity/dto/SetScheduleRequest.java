package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SetScheduleRequest {
    @NotNull
    private Long providerId;
    @NotEmpty
    private List<String> dates;
    @NotBlank
    private String slotStart;
    @NotBlank
    private String slotEnd;
}
