package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.BehaviorEvent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BehaviorEventMapper extends BaseMapper<BehaviorEvent> {
}