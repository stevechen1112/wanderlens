package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 註冊請求 DTO（消費者自助註冊）
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "帳號不可為空")
    private String empno;

    @NotBlank(message = "姓名不可為空")
    private String username;

    @NotBlank(message = "電話不可為空")
    private String phone;

    @Email(message = "Email 格式不正確")
    private String email;

    @NotBlank(message = "密碼不可為空")
    @Size(min = 6, max = 20, message = "密碼長度需為 6-20 碼")
    private String password;
}
