package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.SaveServiceAreaRequest;
import com.wanderlens.api.entity.dto.ServiceAreaResponse;

public interface ProviderAreaService {

    ServiceAreaResponse getServiceArea(Long providerId);

    void saveServiceArea(Long providerId, SaveServiceAreaRequest request);
}
