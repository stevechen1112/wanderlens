package com.joyshot.app.controller;


import cn.hutool.log.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Coupon;
import com.joyshot.app.entity.Order;
import com.joyshot.app.entity.ServiceCat;
import com.joyshot.app.mapper.CouponMapper;
import com.joyshot.app.mapper.ServiceCatMapper;
import com.joyshot.app.service.CouponService;
import com.joyshot.app.service.ServiceCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/coupon")
public class CouponController extends AppBaseController {

    private static final Log logger = Log.get();


    @Autowired
    private CouponService couponService;

    @Autowired
    private CouponMapper couponMapper;



    @GetMapping
    public Result findAll(@RequestParam Integer pageNum,
                          @RequestParam Integer pageSize,
                          HttpServletRequest request) {
        String locale = request.getHeader("locale");
        IPage<Coupon> page = new Page<>(pageNum, pageSize);
        Page<Coupon> result = couponMapper.selectAll(page);
        return Result.success(result);
    }

    @PostMapping
    public Result save(@RequestBody Coupon coupon) {
        boolean result = couponService.saveOrUpdate(coupon);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @GetMapping("/check/duplicate/{code}")
    public Result save(@PathVariable String code) {
        Coupon coupon = couponMapper.findByCouponcCode(code);
        return coupon == null ? Result.success() : Result.warning401(coupon);
    }

    @PostMapping("/apply")
    public Result apply(@RequestBody Order order) throws ParseException {
        Integer discount = couponService.applyCoupon(order);
        return discount != -1 ? Result.success(discount) : Result.error(Status.CODE_ERROR, "coupon碼無效");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = couponService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @GetMapping("/affiliate")
    public Result setAffiliate(@RequestParam Integer id,
                        @RequestParam Integer couponOwner) {
        couponMapper.applyAffiliate(id, couponOwner);
        return Result.success();
    }


}
