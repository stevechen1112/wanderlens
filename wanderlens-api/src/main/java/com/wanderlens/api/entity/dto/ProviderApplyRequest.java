package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 攝影師註冊申請 DTO
 */
@Data
public class ProviderApplyRequest {

    @NotBlank(message = "姓名不可為空")
    private String name;

    @NotBlank(message = "電話不可為空")
    private String phone;

    @Email(message = "Email 格式不正確")
    private String email;

    @NotBlank(message = "縣市不可為空")
    private String city;

    @NotBlank(message = "鄉鎮區不可為空")
    private String districtName;

    private String address;

    /** 服務項目（逗號分隔 ID） */
    @NotBlank(message = "服務項目不可為空")
    private String serviceItem;

    /** 作品集 URL（逗號分隔，最多 10 張） */
    private String portfolioUrls;

    /** 器材描述 */
    private String equipment;

    /** 攝影經歷（年） */
    private Integer experienceYears;

    /** 介紹 */
    private String intro;
}