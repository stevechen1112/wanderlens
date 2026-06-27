package com.wanderlens.api.service;

import com.wanderlens.api.entity.ProviderBank;
import com.wanderlens.api.entity.ProviderFeature;
import com.wanderlens.api.entity.dto.AddProviderWorkRequest;
import com.wanderlens.api.entity.dto.ProviderPublicProfileDto;
import com.wanderlens.api.entity.dto.ProviderWorksViewDto;

import java.util.List;

public interface ProviderProfileService {

    ProviderPublicProfileDto getPublicProfile(String uuid);

    List<ProviderWorksViewDto> listWorksWithUrls(Long providerId);

    ProviderWorksViewDto addWork(Long providerId, AddProviderWorkRequest request);

    void deleteWork(Long providerId, Long workId);

    ProviderFeature saveFeature(Long providerId, ProviderFeature body);

    void deleteFeature(Long providerId, Long featureId);

    ProviderBank saveBank(Long providerId, ProviderBank body);
}
