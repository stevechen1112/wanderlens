package com.joyshot.app.mapper;

import com.joyshot.app.entity.OrderHistory;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【js_order_history】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.OrderHistory
*/
public interface OrderHistoryMapper extends BaseMapper<OrderHistory> {

    @Select("Select * from js_order_history where order_no = #{orderNo} order by id")
    List<OrderHistory> getHistoryByOrderNo(String orderNo);
}




