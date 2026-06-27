package com.wanderlens.api.service;

import java.util.Map;

public interface MatchAnalyticsService {
    void track(String eventType, Long requestId, Long consumerId, Long providerId,
                 String city, Long serviceTypeId, Map<String, Object> metadata);

    Map<String, Object> getDashboardMetrics();
}
