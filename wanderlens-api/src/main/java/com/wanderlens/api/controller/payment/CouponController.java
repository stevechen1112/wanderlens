package com.wanderlens.api.controller.payment;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Coupon;
import com.wanderlens.api.entity.dto.ApplyCouponRequest;
import com.wanderlens.api.entity.dto.CouponResult;
import com.wanderlens.api.service.CouponService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 優惠券 API
 */
@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupon", description = "優惠券")
public class CouponController {

    private final CouponService couponService;
    private final AuthUtil authUtil;

    @PostMapping("/apply")
    @Operation(summary = "套用折扣碼")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<CouponResult> applyCoupon(HttpServletRequest httpRequest,
                                             @Valid @RequestBody ApplyCouponRequest request) {
        // 驗證訂單所有權（IDOR 防護）
        Long userId = (Long) httpRequest.getAttribute("userId");
        // CouponService.applyCoupon 內部需驗證 order.consumerId == userId
        return Result.ok(couponService.applyCoupon(request, userId));
    }

    @GetMapping
    @Operation(summary = "折扣碼列表（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Coupon>> list(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "FINANCE");
        return Result.ok(couponService.list());
    }

    @PostMapping
    @Operation(summary = "建立/更新折扣碼（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Coupon> save(HttpServletRequest request, @RequestBody Coupon coupon) {
        authUtil.requireRole(request, "ADMIN", "FINANCE");
        couponService.saveOrUpdate(coupon);
        return Result.ok(coupon);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除折扣碼（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireRole(request, "ADMIN", "FINANCE");
        couponService.removeById(id);
        return Result.ok();
    }
}