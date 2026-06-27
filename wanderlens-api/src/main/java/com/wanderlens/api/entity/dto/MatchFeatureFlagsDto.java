package com.wanderlens.api.entity.dto;

import lombok.Data;

@Data
public class MatchFeatureFlagsDto {
    /** 即時媒合總開關 */
    private boolean instantMatchEnabled;
    /** 旅拍即時 */
    private boolean travelInstantEnabled;
    /** 街拍隨行 */
    private boolean streetInstantEnabled;
}
