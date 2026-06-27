package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * 搜尋可用供給方請求 DTO
 */
@Data
public class SearchProviderRequest {

    /** 拍攝類型 ID */
    @NotNull(message = "拍攝類型不可為空")
    private Long serviceTypeId;

    /** 拍攝日期 */
    @NotNull(message = "拍攝日期不可為空")
    private LocalDate shootingDate;

    /** 開始時間（HH:mm） */
    @NotBlank(message = "開始時間不可為空")
    private String timeStart;

    /** 結束時間（HH:mm） */
    @NotBlank(message = "結束時間不可為空")
    private String timeEnd;

    /** 縣市 */
    private String city;

    /** 區域 ID */
    private Long areaId;

    /** 大人人數 */
    private Integer adultNum;

    /** 小孩人數 */
    private Integer childNum;

    /** 緯度 */
    private Double lat;

    /** 經度 */
    private Double lng;

    /** 頁碼（從 1 開始，預設 1） */
    private Integer page;

    /** 每頁筆數（預設 20） */
    private Integer pageSize;

    /** 拍攝配置 ID（優先於 suggestedConfig 推導） */
    private Long configurationId;

    /** 攝影師人數（1 或 2，覆寫配置） */
    private Integer photographerCount;

    /** 是否需要造型師（覆寫配置） */
    private Boolean needStylist;

    /** 第二位攝影師 ID（雙機時已選第一位後搜尋第二位） */
    private Long excludePhotographerId;

    /** 拍攝地點文字（交通費計算） */
    private String shootingLocation;
}