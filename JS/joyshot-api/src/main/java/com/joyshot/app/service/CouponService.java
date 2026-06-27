package com.joyshot.app.service;

import com.joyshot.app.entity.Coupon;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.Order;

import java.text.ParseException;

/**
* @author avery
* @description【coupon】的資料庫操作Service
*/
public interface CouponService extends IService<Coupon> {

    Integer applyCoupon(Order order) throws ParseException;

    void updateCoupon(Order order);
}
