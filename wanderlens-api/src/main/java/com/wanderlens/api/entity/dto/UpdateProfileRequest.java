package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

/**
 * 更新個人資料請求 DTO
 */
@Data
public class UpdateProfileRequest {

    private String username;

    private String phone;

    @Email(message = "Email 格式不正確")
    private String email;

    private String avatar;
}
