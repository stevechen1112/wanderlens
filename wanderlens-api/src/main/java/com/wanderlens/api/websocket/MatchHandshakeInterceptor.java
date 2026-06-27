package com.wanderlens.api.websocket;

import com.wanderlens.api.util.JwtUtil;
import com.wanderlens.api.util.ProviderIdResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class MatchHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;
    private final ProviderIdResolver providerIdResolver;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String query = request.getURI().getQuery();
        if (query == null || !query.contains("token=")) {
            return false;
        }
        String token = extractToken(query);
        try {
            var jwt = jwtUtil.verifyToken(token);
            Long userId = Long.parseLong(jwt.getSubject());
            String role = jwt.getClaim("role").asString();
            Long providerId = providerIdResolver.resolve(userId);
            attributes.put("userId", userId);
            attributes.put("providerId", providerId);
            attributes.put("role", role);
            return "PHOTOGRAPHER".equals(role) || "ADMIN".equals(role);
        } catch (Exception e) {
            log.warn("Match WS auth failed: {}", e.getMessage());
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // no-op
    }

    private String extractToken(String query) {
        for (String part : query.split("&")) {
            if (part.startsWith("token=")) {
                return part.substring(6);
            }
        }
        return "";
    }
}
