package com.wanderlens.api.controller.consumer;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.dto.ConsumerPreferenceDto;
import com.wanderlens.api.service.ConsumerPreferenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/consumer/preferences")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "ConsumerPreference", description = "消費者偏好設定")
public class ConsumerPreferenceController {

    private final ConsumerPreferenceService preferenceService;

    @GetMapping
    @Operation(summary = "取得個人偏好")
    public Result<ConsumerPreferenceDto> get(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(preferenceService.getByUserId(userId));
    }

    @PutMapping
    @Operation(summary = "更新個人偏好")
    public Result<Void> save(HttpServletRequest request, @RequestBody ConsumerPreferenceDto body) {
        Long userId = (Long) request.getAttribute("userId");
        preferenceService.save(userId, body);
        return Result.ok();
    }
}
