package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 變更密碼請求 DTO
 */
@Data
public class ChangePasswordRequest {

    @NotBlank(message = "舊密碼不可為空")
    private String oldPassword;

    @NotBlank(message = "新密碼不可為空")
    @Size(min = 6, max = 20, message = "密碼長度需為 6-20 碼")
    private String newPassword;

    @NotBlank(message = "確認密碼不可為空")
    private String confirmPassword;
}