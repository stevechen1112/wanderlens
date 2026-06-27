package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 套用折扣碼請求 DTO
 */
@Data
public class ApplyCouponRequest {

    @NotBlank(message = "訂單編號不可為空")
    private String orderNo;

    @NotBlank(message = "折扣碼不可為空")
    private String couponCode;
}