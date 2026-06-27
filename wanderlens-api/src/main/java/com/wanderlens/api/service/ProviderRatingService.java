package com.wanderlens.api.service;

import com.wanderlens.api.entity.ProviderRating;
import com.wanderlens.api.entity.dto.RatingSummaryDto;

import java.util.List;

public interface ProviderRatingService {
    ProviderRating submitRating(Long consumerId, Long orderId, Long providerId, int stars, String comments);
    List<ProviderRating> getByProviderId(Long providerId, int page, int size);
    RatingSummaryDto getSummary(Long providerId);
    void recalculateProviderRating(Long providerId);
}
