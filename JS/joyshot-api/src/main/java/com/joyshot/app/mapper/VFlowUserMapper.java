package com.joyshot.app.mapper;

import com.joyshot.app.entity.VFlowUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author avery
 * @description【v_flow_user】的資料庫操作Mapper
 * @Entity com.lhdecor.crm.entity.VFlowUser
 */
public interface VFlowUserMapper extends BaseMapper<VFlowUser> {

    List<VFlowUser> selectByFlowId(@Param("flowId") Integer flowId);


}




