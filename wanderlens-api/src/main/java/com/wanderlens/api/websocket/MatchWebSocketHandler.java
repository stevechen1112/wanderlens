package com.wanderlens.api.websocket;

import com.wanderlens.api.service.MatchWebSocketRegistry;
import com.wanderlens.api.service.impl.PhotographerOnlineServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatchWebSocketHandler extends TextWebSocketHandler {

    private final MatchWebSocketRegistry registry;
    private final PhotographerOnlineServiceImpl onlineService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Long providerId = (Long) session.getAttributes().get("providerId");
        if (providerId != null) {
            registry.register(providerId, session);
            onlineService.heartbeat(providerId);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        Long providerId = (Long) session.getAttributes().get("providerId");
        if (providerId == null) return;
        String payload = message.getPayload();
        if ("ping".equalsIgnoreCase(payload) || payload.contains("heartbeat")) {
            onlineService.heartbeat(providerId);
            try {
                session.sendMessage(new TextMessage("pong"));
            } catch (Exception ignored) {
                // ignore
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long providerId = (Long) session.getAttributes().get("providerId");
        if (providerId != null) {
            registry.unregister(providerId);
        }
    }
}
