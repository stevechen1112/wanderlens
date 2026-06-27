package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.OrderHistory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderHistoryMapper extends BaseMapper<OrderHistory> {
}