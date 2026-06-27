package com.joyshot.app.mapper;

import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.PhotographerArea;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【photographer_area】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerArea
*/
public interface PhotographerAreaMapper extends BaseMapper<PhotographerArea> {

    @Delete("delete from photographer_area where ph_id = #{pid}")
    int deleteCurrent(Integer pid);

    @Select("select area_id from photographer_area where ph_id=#{pid}")
    List<Integer> getServiceAreaSetting(Integer pid);
}




