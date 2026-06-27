package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeviceTokenRequest {

    @NotBlank
    private String token;

    private String platform = "EXPO";

    private String appType = "CONSUMER";

    private String deviceId;
}
