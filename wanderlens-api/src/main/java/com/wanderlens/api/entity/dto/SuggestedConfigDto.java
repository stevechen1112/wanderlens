package com.wanderlens.api.entity.dto;

import lombok.Data;

/**
 * 拍攝類型建議配置（對應 ServiceType.suggestedConfig JSON）
 */
@Data
public class SuggestedConfigDto {
    /** OUTDOOR / STUDIO / BOTH */
    private String shootLocation;
    /** 1 或 2 */
    private Integer photographerCount;
    /** 是否需要造型師 */
    private Boolean needStylist;
    /** 對應 configuration 表 ID（可選，優先於上述欄位） */
    private Long configurationId;
}
