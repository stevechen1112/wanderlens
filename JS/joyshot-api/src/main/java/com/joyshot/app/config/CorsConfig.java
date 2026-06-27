package com.joyshot.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author avery
 */

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                // 设置允许跨域的路径
                .addMapping("/**")
                // 设置允许跨域请求的域名
                .allowedOriginPatterns("*")
                // 是否允许证书
                .allowCredentials(true)
                // 设置允许的方法
                .allowedMethods("GET", "POST", "DELETE", "PUT", "PATCH")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }

//    @Bean
//    public WebMvcConfigurer corsConfigurer()
//    {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins("*");
//            }
//        };
//    }

//    private static final long MAX_AGE = 24 * 60 * 60;
//
//    private CorsConfiguration buildConfig() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.addAllowedOrigin("*");
//        configuration.addAllowedHeader("*");
//        configuration.addAllowedMethod("*");
//        configuration.setMaxAge(MAX_AGE);
//        return configuration;
//    }
//
//    @Bean
//    public CorsFilter corsFilter() {
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", buildConfig());
//        return new CorsFilter(source);
//    }
}
