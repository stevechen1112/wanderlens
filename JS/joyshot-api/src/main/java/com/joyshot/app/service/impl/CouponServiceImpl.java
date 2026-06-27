package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Coupon;
import com.joyshot.app.entity.Order;
import com.joyshot.app.mapper.OrderMapper;
import com.joyshot.app.service.CouponService;
import com.joyshot.app.mapper.CouponMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Locale;

/**
* @author avery
* @description【coupon】的資料庫操作Service实现
*/
@Service
public class CouponServiceImpl extends ServiceImpl<CouponMapper, Coupon>
    implements CouponService{

    @Autowired
    private CouponMapper couponMapper;

    /**
     * 更新coupon
     * @param order
     */
    @Override
    public void updateCoupon(Order order) {
        String couponCode = order.getCouponCode();
        //訂單有使用coupon
        if (couponCode != null && !"".equals(couponCode)) {
            Coupon coupon = couponMapper.findByCouponcCode(couponCode);
            coupon.setUsageCountCurrent(coupon.getUsageCountCurrent() + 1);
            couponMapper.updateById(coupon);
        }
    }

    @Override
    public Integer applyCoupon(Order order) throws ParseException {
        Coupon coupon = couponMapper.findByCouponcCode(order.getCouponCode());
        //查無折扣碼
        if (coupon == null) {
            System.out.println("查無折扣碼");
            return -1;
        } else {
            //折扣碼是否可用
            //1.是否在有效期
            boolean dateValid = isCouponDateValid(coupon);
            System.out.println("是否在有效期:" + dateValid);

            //2.目前使用次數是否已滿
            boolean usageValid = isUsageValide(coupon);
            System.out.println("使用次數:" + usageValid);

            //3.價錢是否在低消條件裡
            boolean priceValid = isPriceValid(coupon, order);
            System.out.println("價錢是否在低消:" + priceValid);

            //4.拍攝類型是否在條件裡
            boolean serviceValid = isServiceCategoryValid(coupon, order);
            System.out.println("拍攝類型:" + serviceValid);

            if (dateValid && usageValid && priceValid && serviceValid) {
                return coupon.getDiscount() * -1;
            } else {
                return -1;
            }
        }
    }

    private boolean isCouponDateValid(Coupon coupon) throws ParseException {
        SimpleDateFormat sdformat = new SimpleDateFormat("yyyy/MM/dd");
        Date dateStart = null;
        if (coupon.getDateStart() != null && !"".equals(coupon.getDateStart())) {
            dateStart = sdformat.parse(coupon.getDateStart());
        }

        Date dateEnd = null;
        if (coupon.getDateEnd() != null && !"".equals(coupon.getDateEnd())) {
            dateEnd = sdformat.parse(coupon.getDateEnd());
        }

        Date now = new Date();
        System.out.println("now:" + now + " dateStart:" + dateStart + " dateEnd:" + dateEnd);

        if (dateStart == null && dateEnd == null) { //沒有日期限制
            return true;
        } else if (dateStart != null && dateEnd == null) { //沒有結束日
            //目前日期是否在開始日之後
            return now.compareTo(dateStart) > 0;
        } else if (dateStart == null && dateEnd != null) { //沒有開始日
            //目前日期是否在結束日之後
            return now.compareTo(dateEnd) < 0;
        } else {
            //目前日期是否在開始日與結束日之間
            return now.compareTo(dateStart) > 0 && now.compareTo(dateEnd) < 0;
        }
    }

    private boolean isUsageValide(Coupon coupon) {
        if (coupon.getUsageCount() == 0) {
            return true;
        } else {
            return coupon.getUsageCountCurrent() < coupon.getUsageCount();
        }
    }

    private boolean isPriceValid(Coupon coupon, Order order) {
        if (coupon.getUsagePrice() == 0) {
            return true;
        } else {
            return order.getTotal() >= coupon.getUsagePrice();
        }
    }

    private boolean isServiceCategoryValid(Coupon coupon, Order order) {
        if (coupon.getUsageService() == null || "".equals(coupon.getUsageService())) {
            return true;
        } else {
            return coupon.getUsageService().indexOf(order.getServiceCat()) != -1;
        }
    }

}




