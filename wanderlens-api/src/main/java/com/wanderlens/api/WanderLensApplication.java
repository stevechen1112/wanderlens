package com.wanderlens.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.AsyncConfigurer;

/**
 * WanderLens Platform Core API 主啟動類別
 *
 * @EnableScheduling — 啟用排程任務（CronTaskManager）
 * @EnableAsync(proxyTargetClass = true) — 啟用非同步，使用 CGLIB 代理避免介面代理問題
 */
@SpringBootApplication
@EnableScheduling
@EnableAsync(proxyTargetClass = true)
public class WanderLensApplication {

    public static void main(String[] args) {
        SpringApplication.run(WanderLensApplication.class, args);
    }
}