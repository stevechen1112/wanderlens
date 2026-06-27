package com.wanderlens.api.controller.match;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.MatchRequest;
import com.wanderlens.api.entity.dto.MatchFeatureFlagsDto;
import com.wanderlens.api.mapper.MatchRequestMapper;
import com.wanderlens.api.service.MatchAnalyticsService;
import com.wanderlens.api.service.MatchFeatureService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/match")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "AdminMatch", description = "即時媒合監控")
public class AdminMatchController {

    private final MatchRequestMapper matchRequestMapper;
    private final AuthUtil authUtil;
    private final MatchFeatureService matchFeatureService;
    private final MatchAnalyticsService matchAnalyticsService;

    @GetMapping("/monitor")
    @Operation(summary = "即時媒合監控面板")
    public Result<Map<String, Object>> monitor(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        List<MatchRequest> active = matchRequestMapper.selectList(new LambdaQueryWrapper<MatchRequest>()
                .in(MatchRequest::getStatus, "SEARCHING", "MATCH_FOUND", "PAYMENT_PENDING")
                .orderByDesc(MatchRequest::getCreatedAt)
                .last("LIMIT 50"));
        long searching = active.stream().filter(r -> "SEARCHING".equals(r.getStatus())).count();
        long matched = active.stream().filter(r -> "MATCH_FOUND".equals(r.getStatus())).count();
        Map<String, Object> data = new HashMap<>();
        data.put("searchingCount", searching);
        data.put("matchedCount", matched);
        data.putAll(matchAnalyticsService.getDashboardMetrics());
        data.put("activeRequests", active);
        data.put("timestamp", LocalDateTime.now());
        return Result.ok(data);
    }

    @GetMapping("/orders")
    @Operation(summary = "即時訂單列表")
    public Result<List<MatchRequest>> orders(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        List<MatchRequest> list = matchRequestMapper.selectList(new LambdaQueryWrapper<MatchRequest>()
                .isNotNull(MatchRequest::getOrderId)
                .orderByDesc(MatchRequest::getCreatedAt)
                .last("LIMIT 100"));
        return Result.ok(list);
    }

    @GetMapping("/feature-flags")
    @Operation(summary = "即時媒合功能開關")
    public Result<MatchFeatureFlagsDto> getFeatureFlags(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(matchFeatureService.getFlags());
    }

    @PutMapping("/feature-flags")
    @Operation(summary = "更新即時媒合功能開關")
    public Result<Void> updateFeatureFlags(HttpServletRequest request,
                                           @RequestBody MatchFeatureFlagsDto body) {
        authUtil.requireRole(request, "ADMIN");
        matchFeatureService.updateFlags(body);
        return Result.ok();
    }

    @GetMapping("/analytics")
    @Operation(summary = "媒合數據分析")
    public Result<Map<String, Object>> analytics(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(matchAnalyticsService.getDashboardMetrics());
    }
}
