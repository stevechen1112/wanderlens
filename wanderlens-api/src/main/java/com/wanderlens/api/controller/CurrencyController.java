package com.wanderlens.api.controller;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.util.CurrencyUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/currency")
@RequiredArgsConstructor
@Tag(name = "Currency", description = "多幣別換算（Phase 5）")
public class CurrencyController {

    private final CurrencyUtil currencyUtil;

    @GetMapping("/rates")
    @Operation(summary = "匯率表（TWD 基準）")
    public Result<Map<String, Double>> rates() {
        return Result.ok(currencyUtil.getRates());
    }

    @GetMapping("/convert")
    @Operation(summary = "台幣換算")
    public Result<Map<String, Object>> convert(@RequestParam int twdAmount,
                                               @RequestParam(defaultValue = "USD") String currency) {
        return Result.ok(Map.of(
                "twdAmount", twdAmount,
                "currency", currency.toUpperCase(),
                "convertedAmount", currencyUtil.convertFromTwd(twdAmount, currency),
                "formatted", currencyUtil.formatPrice(twdAmount, currency)
        ));
    }
}
