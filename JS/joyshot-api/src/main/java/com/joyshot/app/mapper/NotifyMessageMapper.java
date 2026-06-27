package com.joyshot.app.mapper;

import com.joyshot.app.entity.NotifyMessage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;

/**
* @author avery
* @description【notify_message】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.NotifyMessage
*/
public interface NotifyMessageMapper extends BaseMapper<NotifyMessage> {

    @Update("update notify_message set is_read = 'Y' where id = #{id}")
    int setMessageRead(@Param("id") Integer id);

    @Update("update notify_message set is_read = 'Y' where todo_id = #{todoId} and message_owner = #{signer}")
    void setJobMessageRead(@Param("todoId") Integer todoId, @Param("signer") Integer signer);
}




