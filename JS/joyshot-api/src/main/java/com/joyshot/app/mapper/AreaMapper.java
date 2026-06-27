package com.joyshot.app.mapper;

import com.joyshot.app.entity.Area;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author avery
 * @Entity com.lhdecor.crm.entity.Area
 */
public interface AreaMapper extends BaseMapper<Area> {

    @Select("Select id from area where name = #{areaName}")
    Integer findAreaByName(@Param("areaName") String areaName);

    @Select("Select id from area where (name = #{areaName} or full_name = #{areaName}) and parent_id is null")
    Integer findArea1ByName(@Param("areaName") String areaName);

    @Select("Select id from area where name = #{areaName} and parent_id = #{area1}")
    Integer findArea2ByName(String areaName, Integer area1);

    @Select("Select id from area where name = #{areaName} and parent_id = #{area2}")
    Integer findArea3ByName(String areaName, Integer area2);

    @Select("Select * from area where parent_id is null")
    List<Area> findArea1();

    @Select("Select * from area where parent_id = #{node}")
    List<Area> getByParentId(String node);

    @Select("Select * from area where parent_id is null and (name = #{city} or full_name = #{name})")
    Area getParentByName(String city);

    @Select("Select * from area where area_group = #{areaGroupId}")
    List<Area> findSameGroupArea(String areaGroupId);
}




