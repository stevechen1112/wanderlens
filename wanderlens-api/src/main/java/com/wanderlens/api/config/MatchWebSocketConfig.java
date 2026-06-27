package com.wanderlens.api.config;

import com.wanderlens.api.websocket.MatchHandshakeInterceptor;
import com.wanderlens.api.websocket.MatchWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class MatchWebSocketConfig implements WebSocketConfigurer {

    private final MatchWebSocketHandler matchWebSocketHandler;
    private final MatchHandshakeInterceptor matchHandshakeInterceptor;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(matchWebSocketHandler, "/ws/match")
                .addInterceptors(matchHandshakeInterceptor)
                .setAllowedOrigins("*");
    }
}
