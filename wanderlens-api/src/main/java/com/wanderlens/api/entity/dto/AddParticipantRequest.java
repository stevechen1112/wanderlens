package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 新增對話參與者請求
 */
@Data
public class AddParticipantRequest {

    @NotNull(message = "userId 不可為空")
    private Long userId;

    @NotNull(message = "userType 不可為空")
    private String userType;  // CONSUMER / PHOTOGRAPHER / STYLIST
}