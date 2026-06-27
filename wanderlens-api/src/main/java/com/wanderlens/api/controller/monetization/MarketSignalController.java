package com.wanderlens.api.controller.monetization;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.service.MarketSignalService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/market-signals")
@RequiredArgsConstructor
@Tag(name = "MarketSignal", description = "跨境市場訊號（Phase 5）")
public class MarketSignalController {

    private final MarketSignalService marketSignalService;
    private final AuthUtil authUtil;

    @PostMapping("/record")
    @Operation(summary = "記錄市場訊號（公開，供 Web/App 埋點）")
    public Result<Void> record(@RequestParam String sourceCountry,
                               @RequestParam(required = false) String sourceCity,
                               @RequestParam String signalType,
                               @RequestParam(required = false) String metadata) {
        marketSignalService.recordSignal(sourceCountry, sourceCity, signalType, metadata);
        return Result.ok();
    }

    @GetMapping("/dashboard")
    @Operation(summary = "市場訊號儀表板（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Map<String, Object>>> dashboard(HttpServletRequest request,
                                                        @RequestParam(defaultValue = "30") int days) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(marketSignalService.getDashboardSummary(days));
    }
}
