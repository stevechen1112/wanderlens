package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Provider;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProviderMapper extends BaseMapper<Provider> {
}