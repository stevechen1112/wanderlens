package com.wanderlens.api.controller.provider;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.ProviderRating;
import com.wanderlens.api.entity.dto.ProviderApplyRequest;
import com.wanderlens.api.entity.dto.ProviderPublicProfileDto;
import com.wanderlens.api.entity.dto.ProviderWorksViewDto;
import com.wanderlens.api.service.ProviderProfileService;
import com.wanderlens.api.service.ProviderRatingService;
import com.wanderlens.api.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 攝影師/供給方 API（公開端點）
 */
@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
@Tag(name = "Provider", description = "攝影師/造型師/攝影棚")
public class ProviderController {

    private final ProviderService providerService;
    private final ProviderProfileService providerProfileService;
    private final com.wanderlens.api.service.ProviderRatingService providerRatingService;

    @PostMapping("/apply")
    @Operation(summary = "攝影師註冊申請", description = "實名、作品集、器材、服務區、拍攝類型能力")
    public Result<Provider> apply(@Valid @RequestBody ProviderApplyRequest request) {
        return Result.ok(providerService.apply(request));
    }

    @GetMapping("/info/{uuid}")
    @Operation(summary = "前台-取得供給方基本資料")
    public Result<Provider> getInfoByUuid(@PathVariable String uuid) {
        return Result.ok(providerService.findByUuid(uuid));
    }

    @GetMapping("/info/{uuid}/profile")
    @Operation(summary = "前台-取得供給方完整公開資料")
    public Result<ProviderPublicProfileDto> getPublicProfile(@PathVariable String uuid) {
        return Result.ok(providerProfileService.getPublicProfile(uuid));
    }

    @GetMapping("/ratings")
    @Operation(summary = "前台-取得評價列表")
    public Result<List<ProviderRating>> getRatings(
            @RequestParam(required = false) Long providerId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (providerId != null) {
            return Result.ok(providerRatingService.getByProviderId(providerId, page, size));
        }
        return Result.ok(providerRatingService.getRecentRatings(page, size));
    }

    @GetMapping("/info/{uuid}/works")
    @Operation(summary = "前台-取得供給方作品集")
    public Result<List<ProviderWorksViewDto>> getWorksByUuid(@PathVariable String uuid) {
        Provider provider = providerService.findByUuid(uuid);
        return Result.ok(providerProfileService.listWorksWithUrls(provider.getId()));
    }
}