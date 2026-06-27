package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddProviderWorkRequest {
    @NotNull
    private Long providerId;
    @NotBlank
    private String fileUuid;
}
