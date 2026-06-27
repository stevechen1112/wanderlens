package com.wanderlens.api.controller;

import com.wanderlens.api.common.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 健康檢查 Controller
 */
@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "健康檢查")
public class HealthController {

    @GetMapping
    @Operation(summary = "健康檢查")
    public Result<Map<String, Object>> health() {
        return Result.ok(Map.of(
                "status", "UP",
                "service", "wanderlens-api",
                "version", "0.0.1-SNAPSHOT",
                "timestamp", System.currentTimeMillis()
        ));
    }
}