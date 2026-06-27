package com.wanderlens.api.entity.dto;

import com.wanderlens.api.entity.Studio;
import lombok.Data;
import java.util.List;

/**
 * 三池媒合結果
 */
@Data
public class MultiPoolSearchResult {

    private Long configurationId;
    private String shootLocation;

    /** 可用攝影師列表 */
    private List<SearchProviderResult> photographers;

    /** 可用攝影棚列表（如配置需要） */
    private List<Studio> studios;

    /** 可用造型師列表（如配置需要） */
    private List<SearchProviderResult> stylists;

    /** 是否需要攝影棚 */
    private boolean needStudio;

    /** 是否需要造型師 */
    private boolean needStylist;

    /** 攝影師人數需求（1 或 2） */
    private int photographerCount;
}