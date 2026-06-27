package com.wanderlens.api.controller.match;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.dto.*;
import com.wanderlens.api.service.MatchFeatureService;
import com.wanderlens.api.service.MatchRequestService;
import com.wanderlens.api.service.PhotographerOnlineService;
import com.wanderlens.api.util.ProviderIdResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/match")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Match", description = "即時媒合")
public class MatchController {

    private final MatchRequestService matchRequestService;
    private final PhotographerOnlineService photographerOnlineService;
    private final MatchFeatureService matchFeatureService;
    private final ProviderIdResolver providerIdResolver;

    @PostMapping("/request")
    @Operation(summary = "發出即時需求")
    public Result<MatchRequestDto> createRequest(HttpServletRequest request,
                                                   @Valid @RequestBody CreateInstantMatchRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(matchRequestService.createRequest(userId, body));
    }

    @GetMapping("/request/{id}")
    @Operation(summary = "查詢需求狀態")
    public Result<MatchRequestDto> getRequest(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(matchRequestService.getRequest(userId, id));
    }

    @DeleteMapping("/request/{id}")
    @Operation(summary = "取消需求")
    public Result<Void> cancelRequest(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        matchRequestService.cancelRequest(userId, id);
        return Result.ok();
    }

    @GetMapping("/request/{id}/stream")
    @Operation(summary = "SSE 狀態推送")
    public SseEmitter streamRequest(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        return matchRequestService.subscribe(userId, id);
    }

    @PostMapping("/request/{id}/pay")
    @Operation(summary = "媒合成功後付款")
    public Result<Map<String, Object>> payAfterMatch(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(matchRequestService.payAfterMatch(userId, id));
    }

    @PostMapping("/request/{id}/accept")
    @Operation(summary = "接受需求")
    public Result<MatchRequestDto> acceptRequest(HttpServletRequest request, @PathVariable Long id) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(matchRequestService.acceptRequest(providerId, id));
    }

    @PostMapping("/request/{id}/decline")
    @Operation(summary = "拒絕/略過需求")
    public Result<Void> declineRequest(HttpServletRequest request, @PathVariable Long id) {
        Long providerId = providerIdResolver.resolve(request);
        matchRequestService.declineRequest(providerId, id);
        return Result.ok();
    }

    @PostMapping("/online")
    @Operation(summary = "開啟接單模式")
    public Result<Void> goOnline(HttpServletRequest request, @RequestBody(required = false) MatchOnlineRequest body) {
        Long providerId = providerIdResolver.resolve(request);
        photographerOnlineService.goOnline(providerId, body != null ? body : new MatchOnlineRequest());
        return Result.ok();
    }

    @PostMapping("/offline")
    @Operation(summary = "關閉接單模式")
    public Result<Void> goOffline(HttpServletRequest request) {
        Long providerId = providerIdResolver.resolve(request);
        photographerOnlineService.goOffline(providerId);
        return Result.ok();
    }

    @GetMapping("/online/status")
    @Operation(summary = "查詢在線狀態")
    public Result<Map<String, Object>> onlineStatus(HttpServletRequest request) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(photographerOnlineService.getOnlineStatus(providerId));
    }

    @PutMapping("/settings")
    @Operation(summary = "更新接單設定")
    public Result<Void> updateSettings(HttpServletRequest request, @RequestBody MatchSettingsDto body) {
        Long providerId = providerIdResolver.resolve(request);
        photographerOnlineService.saveSettings(providerId, body);
        return Result.ok();
    }

    @GetMapping("/settings")
    @Operation(summary = "查詢接單設定")
    public Result<MatchSettingsDto> getSettings(HttpServletRequest request) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(photographerOnlineService.getSettings(providerId));
    }

    @GetMapping("/stats")
    @Operation(summary = "接單統計")
    public Result<Map<String, Object>> stats(HttpServletRequest request) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(matchRequestService.getStats(providerId));
    }

    @GetMapping("/public/status")
    @Operation(summary = "即時媒合公開狀態（無需登入）")
    public Result<MatchFeatureFlagsDto> publicStatus() {
        return Result.ok(matchFeatureService.getFlags());
    }
}
