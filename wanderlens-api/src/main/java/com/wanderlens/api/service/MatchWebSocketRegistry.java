package com.wanderlens.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.entity.dto.MatchBroadcastPayload;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Slf4j
@Component
public class MatchWebSocketRegistry {

    private final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<Long, Set<Long>> requestTargets = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void register(Long photographerId, WebSocketSession session) {
        sessions.put(photographerId, session);
    }

    public void unregister(Long photographerId) {
        sessions.remove(photographerId);
    }

    public void registerTargets(Long requestId, Set<Long> photographerIds) {
        requestTargets.put(requestId, new CopyOnWriteArraySet<>(photographerIds));
    }

    public void sendToProvider(Long providerId, MatchBroadcastPayload payload) {
        WebSocketSession session = sessions.get(providerId);
        if (session != null && session.isOpen()) {
            send(session, payload);
        }
    }

    public void broadcastNewRequest(MatchBroadcastPayload payload) {
        Set<Long> targets = requestTargets.getOrDefault(payload.getRequestId(), Set.of());
        for (Long providerId : targets) {
            WebSocketSession session = sessions.get(providerId);
            if (session != null && session.isOpen()) {
                send(session, payload);
            }
        }
    }

    public void broadcastClosed(Long requestId) {
        Set<Long> targets = requestTargets.remove(requestId);
        if (targets == null) return;
        MatchBroadcastPayload payload = MatchBroadcastPayload.builder()
                .type("MATCH_CLOSED")
                .requestId(requestId)
                .build();
        for (Long providerId : targets) {
            WebSocketSession session = sessions.get(providerId);
            if (session != null && session.isOpen()) {
                send(session, payload);
            }
        }
    }

    private void send(WebSocketSession session, Object payload) {
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
        } catch (IOException e) {
            log.debug("WebSocket send failed: {}", e.getMessage());
        }
    }
}
