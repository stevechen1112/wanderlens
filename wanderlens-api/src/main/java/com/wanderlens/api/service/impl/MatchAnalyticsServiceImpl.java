package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.entity.MatchEvent;
import com.wanderlens.api.entity.MatchRequest;
import com.wanderlens.api.mapper.MatchEventMapper;
import com.wanderlens.api.mapper.MatchRequestMapper;
import com.wanderlens.api.service.MatchAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchAnalyticsServiceImpl implements MatchAnalyticsService {

    private final MatchEventMapper matchEventMapper;
    private final MatchRequestMapper matchRequestMapper;
    private final ObjectMapper objectMapper;

    @Override
    public void track(String eventType, Long requestId, Long consumerId, Long providerId,
                      String city, Long serviceTypeId, Map<String, Object> metadata) {
        try {
            MatchEvent event = new MatchEvent();
            event.setEventType(eventType);
            event.setRequestId(requestId);
            event.setConsumerId(consumerId);
            event.setProviderId(providerId);
            event.setCity(city);
            event.setServiceTypeId(serviceTypeId);
            if (metadata != null && !metadata.isEmpty()) {
                event.setMetadata(objectMapper.writeValueAsString(metadata));
            }
            matchEventMapper.insert(event);
        } catch (Exception e) {
            log.warn("Failed to track match event {}: {}", eventType, e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getDashboardMetrics() {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<MatchEvent> events = matchEventMapper.selectList(new LambdaQueryWrapper<MatchEvent>()
                .ge(MatchEvent::getCreatedAt, since));

        long created = events.stream().filter(e -> "REQUEST_CREATED".equals(e.getEventType())).count();
        long accepted = events.stream().filter(e -> "ACCEPT".equals(e.getEventType())).count();
        long fallback = events.stream().filter(e -> "FALLBACK".equals(e.getEventType())).count();
        long timeout = events.stream().filter(e -> "TIMEOUT".equals(e.getEventType())).count();

        long totalRequests = matchRequestMapper.selectCount(null);
        long matched = matchRequestMapper.selectCount(new LambdaQueryWrapper<MatchRequest>()
                .in(MatchRequest::getStatus, "MATCH_FOUND", "PAYMENT_PENDING", "COMPLETED"));

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("periodDays", 30);
        metrics.put("requestsCreated30d", created);
        metrics.put("requestsAccepted30d", accepted);
        metrics.put("fallback30d", fallback);
        metrics.put("timeout30d", timeout);
        metrics.put("matchRate", created > 0 ? Math.round(accepted * 1000.0 / created) / 10.0 : 0);
        metrics.put("totalRequestsAllTime", totalRequests);
        metrics.put("matchedAllTime", matched);
        metrics.put("timestamp", LocalDateTime.now());
        return metrics;
    }
}
