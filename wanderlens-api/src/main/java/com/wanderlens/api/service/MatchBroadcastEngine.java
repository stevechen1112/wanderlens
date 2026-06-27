package com.wanderlens.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.entity.dto.MatchBroadcastPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatchBroadcastEngine {

    public static final String CHANNEL = "match:broadcast";

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final MatchWebSocketRegistry webSocketRegistry;

    public void publish(MatchBroadcastPayload payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            stringRedisTemplate.convertAndSend(CHANNEL, json);
            dispatchLocally(payload);
        } catch (Exception e) {
            log.warn("Match broadcast publish failed: {}", e.getMessage());
        }
    }

    public void dispatchLocally(MatchBroadcastPayload payload) {
        if (payload.getType() == null) return;
        switch (payload.getType()) {
            case "NEW_REQUEST" -> {
                if (payload.getRequestId() != null) {
                    webSocketRegistry.broadcastNewRequest(payload);
                }
            }
            case "MATCH_CLOSED" -> webSocketRegistry.broadcastClosed(payload.getRequestId());
            default -> log.debug("Unhandled match broadcast type: {}", payload.getType());
        }
    }

    public void handleMessage(String json) {
        try {
            MatchBroadcastPayload payload = objectMapper.readValue(json, MatchBroadcastPayload.class);
            dispatchLocally(payload);
        } catch (Exception e) {
            log.warn("Match broadcast handle failed: {}", e.getMessage());
        }
    }
}
