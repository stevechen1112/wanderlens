package com.wanderlens.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.wanderlens.api.interceptor.JwtInterceptor;

/**
 * Spring Security 配置
 * - 無狀態 Session（JWT）
 * - BCrypt 密碼編碼
 * - 路徑權限控制
 * - JWT 攔截器
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtInterceptor jwtInterceptor;

    public SecurityConfig(JwtInterceptor jwtInterceptor) {
        this.jwtInterceptor = jwtInterceptor;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                // 收緊 CORS：僅允許已知前端域名
                corsConfig.setAllowedOrigins(java.util.List.of(
                    "http://localhost:3001",
                    "http://localhost:3010",
                    "http://localhost:3002",
                    "http://localhost:3003",
                    "http://localhost:3005",
                    "http://localhost:8081",
                    "http://localhost:8082",
                    "http://localhost:19006",
                    "http://localhost:19010",
                    "http://localhost:19011",
                    "http://localhost:80",
                    "https://wanderlens.app",
                    "https://admin.wanderlens.app",
                    "https://jsmaster.wanderlens.app",
                    "https://wanderlenstw.com",
                    "https://www.wanderlenstw.com",
                    "https://api.wanderlenstw.com",
                    "https://provider.wanderlenstw.com",
                    "https://admin.wanderlenstw.com",
                    "https://retouch.wanderlenstw.com",
                    "https://app.wanderlenstw.com",
                    "https://papp.wanderlenstw.com"
                ));
                corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                corsConfig.setAllowedHeaders(java.util.List.of("*"));
                corsConfig.setAllowCredentials(true);
                corsConfig.setMaxAge(3600L);
                return corsConfig;
            }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 公開路徑（精確區分）
                .requestMatchers(
                    "/auth/login",
                    "/auth/register",
                    "/providers/apply",
                    "/providers/info/**",
                    "/providers/ratings",
                    "/service-types",
                    "/service-types/**",
                    "/configurations",
                    "/search/service-types",
                    "/search/service-types/**",
                    "/search/configurations",
                    "/search/providers",
                    "/search/multi-pool",
                    "/match/public/**",
                    "/areas/tree",
                    "/banners/type/**",
                    "/news/on",
                    "/faqs",
                    "/attractions",
                    "/instagram",
                    "/currency/**",
                    "/market-signals/record",
                    "/affiliates/click",
                    "/albums/public",
                    "/albums/location/**",
                    "/albums/public/**",
                    "/payment/ecpay/callback",
                    "/line/webhook",
                    "/ws/match",
                    "/media/verify",
                    "/media/ai-status",
                    "/media/ai-complete",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                    // actuator 不公開，需認證
                ).permitAll()
                // 其他路徑需認證
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtInterceptor, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}