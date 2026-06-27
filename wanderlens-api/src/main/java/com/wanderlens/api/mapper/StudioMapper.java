package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Studio;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudioMapper extends BaseMapper<Studio> {
}