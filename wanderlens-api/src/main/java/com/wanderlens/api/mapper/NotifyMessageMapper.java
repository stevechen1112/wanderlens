package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.NotifyMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface NotifyMessageMapper extends BaseMapper<NotifyMessage> {

    @Select("SELECT COUNT(*) FROM notify_message WHERE message_owner = #{userId} AND is_read = false")
    int countUnread(Long userId);
}