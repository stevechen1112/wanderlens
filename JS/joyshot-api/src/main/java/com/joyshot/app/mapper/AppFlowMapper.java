package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.joyshot.app.entity.AppFlow;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.GroupByDTO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【app_flow】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.AppFlow
*/
public interface AppFlowMapper extends BaseMapper<AppFlow> {

    @Select("select count(*) count, flow_cat col from app_flow group by flow_cat")
    List<GroupByDTO> selectGroupByName();

    IPage<AppFlow> selectPageWithKeyword(IPage<AppFlow> page, String cat);

    @Delete("delete from app_flow_user where flow_id = #{flowId}")
    void deleteByFlowId(Integer id);

    @Select("select * from app_flow where flow_type = #{type}")
    AppFlow selectByType(String type);
}




