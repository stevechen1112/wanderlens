package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.Coupon;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

/**
* @author avery
* @description【coupon】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Coupon
*/
public interface CouponMapper extends BaseMapper<Coupon> {

    Page<Coupon> selectAll(IPage<Coupon> page);

    @Select("Select * from coupon where coupon_code = #{code}")
    Coupon findByCouponcCode(String code);

    @Update("Update coupon set coupon_owner = #{couponOwner}  where id = #{id}")
    void applyAffiliate(Integer id, Integer couponOwner);
}




