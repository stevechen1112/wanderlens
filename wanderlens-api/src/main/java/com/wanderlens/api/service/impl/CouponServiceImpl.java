package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Coupon;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.dto.ApplyCouponRequest;
import com.wanderlens.api.entity.dto.CouponResult;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.CouponMapper;
import com.wanderlens.api.service.CouponService;
import com.wanderlens.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon> implements CouponService {

    private final OrderService orderService;

    @Override
    @Transactional
    public CouponResult applyCoupon(ApplyCouponRequest request, Long userId) {
        // 1. 查詢折扣碼
        Coupon coupon = findByCode(request.getCouponCode());
        if (coupon == null) {
            return CouponResult.fail("折扣碼不存在");
        }

        // 2. 驗證有效期間
        LocalDate today = LocalDate.now();
        if (coupon.getDateStart() != null && today.isBefore(coupon.getDateStart())) {
            return CouponResult.fail("折扣碼尚未開始");
        }
        if (coupon.getDateEnd() != null && today.isAfter(coupon.getDateEnd())) {
            return CouponResult.fail("折扣碼已過期");
        }

        // 3. 驗證使用次數
        if (coupon.getUsageCount() != null && coupon.getUsageCountCurrent() != null) {
            if (coupon.getUsageCountCurrent() >= coupon.getUsageCount()) {
                return CouponResult.fail("折扣碼已使用完畢");
            }
        }

        // 4. 查詢訂單
        Order order = orderService.getOne(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, request.getOrderNo()));
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        // 4.5 驗證訂單所有權（IDOR 防護）
        if (!order.getConsumerId().equals(userId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限對此訂單套用折扣碼");
        }

        // 5. 驗證低消
        if (coupon.getUsagePrice() != null && order.getTotalFee() < coupon.getUsagePrice()) {
            return CouponResult.fail("訂單金額未達折扣碼低消");
        }

        // 6. 驗證服務類型
        if (coupon.getUsageService() != null && !coupon.getUsageService().isEmpty()) {
            if (!coupon.getUsageService().contains(order.getServiceTypeId().toString())) {
                return CouponResult.fail("折扣碼不適用此拍攝類型");
            }
        }

        // 7. 套用折扣
        int discount = coupon.getDiscount();
        int newTotal = order.getTotalFee() - discount;
        if (newTotal < 0) newTotal = 0;

        order.setCouponCode(coupon.getCouponCode());
        order.setCouponDiscount(discount);
        order.setTotalFee(newTotal);
        orderService.updateById(order);

        // 8. 更新使用次數
        if (coupon.getUsageCountCurrent() == null) {
            coupon.setUsageCountCurrent(0);
        }
        coupon.setUsageCountCurrent(coupon.getUsageCountCurrent() + 1);
        updateById(coupon);

        log.info("折扣碼套用: orderNo={}, coupon={}, discount={}, newTotal={}",
                request.getOrderNo(), request.getCouponCode(), discount, newTotal);

        return CouponResult.success(discount, newTotal);
    }

    @Override
    public Coupon findByCode(String couponCode) {
        return getOne(new LambdaQueryWrapper<Coupon>()
                .eq(Coupon::getCouponCode, couponCode));
    }
}