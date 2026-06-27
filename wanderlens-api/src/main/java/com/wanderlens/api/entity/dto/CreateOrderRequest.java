package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 建立訂單請求 DTO
 */
@Data
public class CreateOrderRequest {

    @NotNull(message = "攝影師不可為空")
    private Long photographerId;

    private Long stylistId;
    private Long studioId;

    @NotNull(message = "拍攝類型不可為空")
    private Long serviceTypeId;

    @NotNull(message = "拍攝配置不可為空")
    private Long configurationId;

    @NotNull(message = "拍攝日期不可為空")
    private LocalDate shootingDate;

    @NotBlank(message = "拍攝時間不可為空")
    private String shootingTime;

    @NotNull(message = "拍攝時數不可為空")
    private BigDecimal shootingDuration;

    @NotBlank(message = "拍攝地點不可為空")
    private String shootingLocation;

    private Double shootingLat;
    private Double shootingLng;

    private Integer adultNum;
    private Integer childNum;

    @NotBlank(message = "客戶姓名不可為空")
    private String customerName;

    @NotBlank(message = "客戶電話不可為空")
    private String customerPhone;

    private String email;
    private String couponCode;

    /** 第二位攝影師 ID（雙機） */
    private Long secondPhotographerId;

    /** 可用時段 ID（用於鎖定） */
    private Long availabilityId;

    /** 第二位攝影師可用時段 ID（雙機鎖定） */
    private Long secondAvailabilityId;
}