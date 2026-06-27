package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Coupon;
import com.wanderlens.api.entity.dto.ApplyCouponRequest;
import com.wanderlens.api.entity.dto.CouponResult;

public interface CouponService extends IService<Coupon> {

    /**
     * 套用折扣碼（含訂單所有權驗證）
     */
    CouponResult applyCoupon(ApplyCouponRequest request, Long userId);

    /**
     * 依折扣碼查詢
     */
    Coupon findByCode(String couponCode);
}