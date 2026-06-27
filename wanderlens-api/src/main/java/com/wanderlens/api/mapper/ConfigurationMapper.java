package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Configuration;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConfigurationMapper extends BaseMapper<Configuration> {
}