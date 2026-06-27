package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.ShootEvent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShootEventMapper extends BaseMapper<ShootEvent> {
}