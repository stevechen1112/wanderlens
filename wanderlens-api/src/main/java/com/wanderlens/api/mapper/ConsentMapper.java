package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Consent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConsentMapper extends BaseMapper<Consent> {
}