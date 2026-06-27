package com.joyshot.app.mapper;

import com.joyshot.app.entity.Ecpay;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

/**
* @author avery
* @description【ecpay】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Ecpay
*/
public interface EcpayMapper extends BaseMapper<Ecpay> {

    @Select("select * from ecpay where hour=#{hour}")
    Ecpay selectByHour(String hour);
}




