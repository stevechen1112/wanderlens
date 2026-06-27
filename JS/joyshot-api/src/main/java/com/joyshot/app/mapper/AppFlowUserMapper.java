package com.joyshot.app.mapper;

import com.joyshot.app.entity.AppFlowUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;

/**
* @author avery
* @description【app_flow_user】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.AppFlowUser
*/
public interface AppFlowUserMapper extends BaseMapper<AppFlowUser> {

    @Delete("delete from app_flow_user where flow_id = #{id}")
    boolean deleteByFlowId(Integer id);
}




