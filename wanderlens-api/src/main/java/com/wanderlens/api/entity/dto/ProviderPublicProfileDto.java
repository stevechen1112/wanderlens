package com.wanderlens.api.entity.dto;

import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.ProviderFeature;
import com.wanderlens.api.entity.ServiceType;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProviderPublicProfileDto {
    private Provider provider;
    private List<ServiceType> serviceTypes;
    private List<String> serviceAreaNames;
    private List<ProviderFeature> features;
    private List<ProviderWorksViewDto> works;
    private RatingSummaryDto ratingSummary;
}
