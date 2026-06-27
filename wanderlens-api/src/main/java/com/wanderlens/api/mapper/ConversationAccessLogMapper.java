package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.ConversationAccessLog;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConversationAccessLogMapper extends BaseMapper<ConversationAccessLog> {
}