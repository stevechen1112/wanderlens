package com.wanderlens.api.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.entity.Configuration;
import com.wanderlens.api.entity.ServiceType;
import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SuggestedConfigDto;
import com.wanderlens.api.service.ConfigurationService;
import com.wanderlens.api.service.ServiceTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 解析拍攝配置：configurationId → Configuration 表 → suggestedConfig JSON → 預設值
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ConfigurationResolver {

    private final ConfigurationService configurationService;
    private final ServiceTypeService serviceTypeService;
    private final ObjectMapper objectMapper;

    public ResolvedConfiguration resolve(SearchProviderRequest request) {
        ResolvedConfiguration resolved = new ResolvedConfiguration();
        resolved.setPhotographerCount(1);
        resolved.setNeedStylist(false);
        resolved.setNeedStudio(false);
        resolved.setShootLocation("OUTDOOR");

        // 1. 直接指定 configurationId
        if (request.getConfigurationId() != null) {
            Configuration config = configurationService.getById(request.getConfigurationId());
            if (config != null) {
                applyConfiguration(resolved, config);
                resolved.setConfigurationId(config.getId());
            }
        }

        // 2. 從 ServiceType.suggestedConfig JSON 推導
        if (request.getServiceTypeId() != null && resolved.getConfigurationId() == null) {
            try {
                ServiceType st = serviceTypeService.getById(request.getServiceTypeId());
                if (st != null && st.getSuggestedConfig() != null && !st.getSuggestedConfig().isBlank()) {
                    SuggestedConfigDto dto = objectMapper.readValue(st.getSuggestedConfig(), SuggestedConfigDto.class);
                    if (dto.getConfigurationId() != null) {
                        Configuration config = configurationService.getById(dto.getConfigurationId());
                        if (config != null) {
                            applyConfiguration(resolved, config);
                            resolved.setConfigurationId(config.getId());
                        }
                    } else {
                        if (dto.getShootLocation() != null) resolved.setShootLocation(dto.getShootLocation());
                        if (dto.getPhotographerCount() != null) resolved.setPhotographerCount(dto.getPhotographerCount());
                        if (dto.getNeedStylist() != null) resolved.setNeedStylist(dto.getNeedStylist());
                        resolved.setNeedStudio(needsStudio(resolved.getShootLocation()));
                    }
                }
            } catch (Exception e) {
                log.warn("解析 suggestedConfig 失敗: serviceTypeId={}", request.getServiceTypeId(), e);
            }
        }

        // 3. 請求覆寫
        if (request.getPhotographerCount() != null && request.getPhotographerCount() >= 1) {
            resolved.setPhotographerCount(Math.min(request.getPhotographerCount(), 2));
        }
        if (request.getNeedStylist() != null) {
            resolved.setNeedStylist(request.getNeedStylist());
        }

        resolved.setNeedStudio(needsStudio(resolved.getShootLocation()));

        return resolved;
    }

    private void applyConfiguration(ResolvedConfiguration resolved, Configuration config) {
        resolved.setConfigurationId(config.getId());
        resolved.setShootLocation(config.getShootLocation());
        resolved.setPhotographerCount(config.getPhotographerCount() != null ? config.getPhotographerCount() : 1);
        resolved.setNeedStylist(Boolean.TRUE.equals(config.getNeedStylist()));
        resolved.setNeedStudio(needsStudio(config.getShootLocation()));
    }

    private boolean needsStudio(String shootLocation) {
        return "STUDIO".equals(shootLocation) || "BOTH".equals(shootLocation);
    }

    @lombok.Data
    public static class ResolvedConfiguration {
        private Long configurationId;
        private String shootLocation;
        private int photographerCount;
        private boolean needStylist;
        private boolean needStudio;
    }
}
