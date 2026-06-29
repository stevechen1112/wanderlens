package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.ConversationParticipant;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ConversationParticipantMapper extends BaseMapper<ConversationParticipant> {
}