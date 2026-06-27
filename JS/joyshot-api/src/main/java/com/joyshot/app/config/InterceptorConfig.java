package com.joyshot.app.config;

import com.joyshot.app.interceptor.MyJwtInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author avery
 */
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
//        System.out.println("addInterceptors:");
        registry.addInterceptor(myJwtInterceptor())
                //攔截所有
                .addPathPatterns("/**")
                //排除攔截
                .excludePathPatterns(
                        "/favicon.ico",
                        "/error",
                        "/api/googledrive/signin",
                        "/api/googledrive/oauth",
                        "/api/order/paid",
                        "/api/order-paid/thank-you",
                        "/api/user/login",
                        "/api/file/**",
                        "/api/client/**",
                        "/api/customer/export",
                        "/api/customer/imp/**",
                        "/api/**/export",
                        "/api/**/export-current",
                        "/api/**/imp",
                        "/swagger-resources/**",
                        "/swagger-ui.html/swagger-resources",
                        "/api/line/**",
                        "/api/sign/**");
    }

    //讓容器認得這個bean
    @Bean
    public MyJwtInterceptor myJwtInterceptor() {
        return new MyJwtInterceptor();
    }
}
