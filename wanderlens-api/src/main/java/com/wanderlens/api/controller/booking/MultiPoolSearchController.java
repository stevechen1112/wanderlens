package com.wanderlens.api.controller.booking;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.dto.MultiPoolSearchResult;
import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.service.MultiPoolSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 三池媒合 API
 */
@RestController
@RequestMapping("/search/multi-pool")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "預約與媒合")
public class MultiPoolSearchController {

    private final MultiPoolSearchService multiPoolSearchService;

    @PostMapping
    @Operation(summary = "三池媒合搜尋", description = "攝影師 ∩ 攝影棚 ∩ 造型師")
    public Result<MultiPoolSearchResult> searchMultiPool(@Valid @RequestBody SearchProviderRequest request) {
        return Result.ok(multiPoolSearchService.searchMultiPool(request));
    }
}