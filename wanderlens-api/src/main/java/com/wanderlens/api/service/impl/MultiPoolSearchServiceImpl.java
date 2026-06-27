package com.wanderlens.api.service.impl;

import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.Studio;
import com.wanderlens.api.entity.dto.MultiPoolSearchResult;
import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SearchProviderResult;
import com.wanderlens.api.service.MultiPoolSearchService;
import com.wanderlens.api.service.SearchService;
import com.wanderlens.api.service.StudioService;
import com.wanderlens.api.service.StylistService;
import com.wanderlens.api.util.ConfigurationResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 三池媒合引擎實作
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MultiPoolSearchServiceImpl implements MultiPoolSearchService {

    private final SearchService searchService;
    private final StudioService studioService;
    private final StylistService stylistService;
    private final ConfigurationResolver configurationResolver;

    @Override
    public MultiPoolSearchResult searchMultiPool(SearchProviderRequest request) {
        ConfigurationResolver.ResolvedConfiguration config = configurationResolver.resolve(request);

        MultiPoolSearchResult result = new MultiPoolSearchResult();
        result.setConfigurationId(config.getConfigurationId());
        result.setShootLocation(config.getShootLocation());
        result.setPhotographerCount(config.getPhotographerCount());
        result.setNeedStudio(config.isNeedStudio());
        result.setNeedStylist(config.isNeedStylist());

        // 回寫 configurationId 供前端使用
        if (request.getConfigurationId() == null && config.getConfigurationId() != null) {
            request.setConfigurationId(config.getConfigurationId());
        }

        // 1. 攝影師池
        List<SearchProviderResult> photographers = searchService.searchProviders(request);
        if (request.getExcludePhotographerId() != null) {
            photographers = photographers.stream()
                    .filter(p -> !request.getExcludePhotographerId().equals(p.getProviderId()))
                    .collect(Collectors.toList());
        }
        result.setPhotographers(photographers);

        // 2. 攝影棚池
        if (config.isNeedStudio()) {
            List<Studio> studios = studioService.searchAvailable(
                    request.getShootingDate(),
                    request.getTimeStart(),
                    request.getTimeEnd(),
                    request.getCity(),
                    request.getServiceTypeId()
            );
            result.setStudios(studios);
        }

        // 3. 造型師池
        if (config.isNeedStylist()) {
            List<Provider> stylists = stylistService.searchAvailable(
                    request.getShootingDate(),
                    request.getTimeStart(),
                    request.getTimeEnd(),
                    request.getCity()
            );
            List<SearchProviderResult> stylistResults = stylists.stream().map(this::toSearchResult).collect(Collectors.toList());
            result.setStylists(stylistResults);
        }

        log.info("三池媒合: type={}, config={}, photographers={}, studios={}, stylists={}",
                request.getServiceTypeId(), config.getConfigurationId(),
                photographers.size(),
                result.getStudios() != null ? result.getStudios().size() : 0,
                result.getStylists() != null ? result.getStylists().size() : 0);

        return result;
    }

    private SearchProviderResult toSearchResult(Provider s) {
        SearchProviderResult sr = new SearchProviderResult();
        sr.setProviderId(s.getId());
        sr.setProviderUuid(s.getProviderUuid());
        sr.setNickName(s.getNickName());
        sr.setCity(s.getCity());
        sr.setAvatar(s.getAvatar());
        sr.setBannerImg(s.getBannerImg());
        sr.setRating(s.getRating());
        sr.setAvailable(true);
        return sr;
    }
}
