package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 登入請求 DTO
 */
@Data
public class LoginRequest {

    @NotBlank(message = "帳號不可為空")
    private String empno;

    @NotBlank(message = "密碼不可為空")
    @Size(min = 6, max = 20, message = "密碼長度需為 6-20 碼")
    private String password;
}