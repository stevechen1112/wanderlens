package com.wanderlens.api.interceptor;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * JWT 認證攔截器
 * - 從 Authorization header 取出 Bearer token
 * - 驗證 token 並設定 SecurityContext
 * - 檢查 token 黑名單（登出後 token 立即失效）
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtInterceptor extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String TOKEN_BLACKLIST_PREFIX = "jwt:blacklist:";

    /**
     * 直接寫入 401 JSON 錯誤回應，避免在 Filter 階段拋出 ServiceException
     * 被當成未處理例外而回傳 500 HTML。
     */
    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        Map<String, Object> body = new HashMap<>();
        body.put("code", ResultCode.TOKEN_INVALID.getCode());
        body.put("message", message);
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if ((authHeader == null || !authHeader.startsWith(BEARER_PREFIX))
                && request.getParameter("token") != null
                && request.getRequestURI() != null
                && request.getRequestURI().contains("/stream")) {
            authHeader = BEARER_PREFIX + request.getParameter("token");
        }

        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX)) {
            String token = authHeader.substring(BEARER_PREFIX.length());

            try {
                // 檢查 token 是否在黑名單中（已登出）
                Boolean isBlacklisted = redisTemplate.hasKey(TOKEN_BLACKLIST_PREFIX + token);
                if (Boolean.TRUE.equals(isBlacklisted)) {
                    log.warn("已登出的 token 被使用");
                    SecurityContextHolder.clearContext();
                    writeUnauthorized(response, "Token 已失效，請重新登入");
                    return;
                }

                // 只驗證一次 token，取出所有 claim
                com.auth0.jwt.interfaces.DecodedJWT jwt = jwtUtil.verifyToken(token);
                Long userId = Long.parseLong(jwt.getSubject());
                String empno = jwt.getClaim("empno").asString();
                String role = jwt.getClaim("role").asString();

                // 設定 SecurityContext
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 將使用者資訊放入 request attribute 供 Controller 使用
                request.setAttribute("userId", userId);
                request.setAttribute("empno", empno);
                request.setAttribute("role", role);

            } catch (Exception e) {
                log.warn("JWT 驗證失敗: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                writeUnauthorized(response, "Token 驗證失敗，請重新登入");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}