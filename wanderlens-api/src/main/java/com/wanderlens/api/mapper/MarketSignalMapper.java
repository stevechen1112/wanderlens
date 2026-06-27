package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.MarketSignal;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MarketSignalMapper extends BaseMapper<MarketSignal> {
}
