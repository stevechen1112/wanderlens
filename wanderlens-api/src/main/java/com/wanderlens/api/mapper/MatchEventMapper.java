package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.MatchEvent;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchEventMapper extends BaseMapper<MatchEvent> {
}
