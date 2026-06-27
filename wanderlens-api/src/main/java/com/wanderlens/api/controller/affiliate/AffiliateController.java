package com.wanderlens.api.controller.affiliate;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.AffiliatePartner;
import com.wanderlens.api.service.AffiliateService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/affiliates")
@RequiredArgsConstructor
@Tag(name = "Affiliate", description = "聯盟行銷")
public class AffiliateController {

    private final AffiliateService affiliateService;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "推廣員列表")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<AffiliatePartner>> list(HttpServletRequest request) {
        authUtil.requireAdmin(request);
        return Result.ok(affiliateService.listAll());
    }

    @GetMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<AffiliatePartner> get(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        return Result.ok(affiliateService.getById(id));
    }

    @PostMapping
    @Operation(summary = "新增/更新推廣員")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<AffiliatePartner> save(HttpServletRequest request, @RequestBody AffiliatePartner body) {
        authUtil.requireAdmin(request);
        return Result.ok(affiliateService.savePartner(body));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        affiliateService.deletePartner(id);
        return Result.ok();
    }

    @PostMapping("/click")
    @Operation(summary = "記錄推薦連結點擊（公開）")
    public Result<Void> recordClick(@RequestParam String referralCode,
                                    @RequestParam(required = false) String sourceUrl,
                                    HttpServletRequest request) {
        affiliateService.recordClick(referralCode, sourceUrl,
                request.getRemoteAddr(), request.getHeader("User-Agent"));
        return Result.ok();
    }
}
