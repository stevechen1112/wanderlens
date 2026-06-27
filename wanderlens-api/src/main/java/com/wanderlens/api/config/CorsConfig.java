package com.wanderlens.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * CORS 配置
 * - dev 環境允許 localhost 各 port
 * - prod 環境限制白名單域名
 */
@Configuration
public class CorsConfig {

    @Value("${wanderlens.frontend.web:http://localhost:3001}")
    private String webUrl;

    @Value("${wanderlens.frontend.provider:http://localhost:3002}")
    private String providerUrl;

    @Value("${wanderlens.frontend.admin:http://localhost:3003}")
    private String adminUrl;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // 允許的來源
        config.setAllowedOrigins(List.of(
                webUrl,
                providerUrl,
                adminUrl,
                "http://localhost:80",      // nginx
                "http://localhost:3001",    // nuxt preview / consumer web
                "http://localhost:3010",    // nuxt preview (E2E)
                "http://localhost:3005",    // retouch
                "http://localhost:8081",    // expo web (legacy)
                "http://localhost:19006",   // expo dev tools
                "http://localhost:19010",   // expo web (consumer app)
                "http://localhost:19011",   // expo web (provider app)
                "http://localhost:9666",    // 舊 JS app port（過渡期）
                "http://localhost:9777",    // 舊 JS provider port（過渡期）
                "http://localhost:9555"     // 舊 JS admin port（過渡期）
        ));

        // 允許的方法
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // 允許的 header
        config.setAllowedHeaders(List.of("*"));

        // 允許帶 Credentials
        config.setAllowCredentials(true);

        // 預檢請求快取時間
        config.setMaxAge(3600L);

        // 暴露的 header
        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}