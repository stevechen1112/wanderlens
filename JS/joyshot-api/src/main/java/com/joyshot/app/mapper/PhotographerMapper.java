package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.entity.Photographer;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.PhotographerFeature;
import com.joyshot.app.entity.PhotographerSearchForm;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
* @author avery
* @description【photographer】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Photographer
*/
public interface PhotographerMapper extends BaseMapper<Photographer> {

    List<Photographer> search(PhotographerSearchForm form);

    Page<Photographer> selectByArea1(IPage<Photographer> page, Integer areaId);

    Photographer getPhotographerInfoById(Integer pid);

    Page<Photographer> selectByPage(IPage<Photographer> page, String queryField, String keyword);

    List<GroupByDTO> selectGroupByCity();

    Photographer getPhotographerInfoByUuid(String uuid);

    Photographer getPhotographerBasicByUuid(String uuid);

    @Select("Select * from photographer where phone=#{phone}")
    Photographer getPhotographerInfoByPhone(String phone);

    @Update("update photographer set go_live = #{goLive} where id = #{id}")
    int saveGoLiveStatus(Integer id, String goLive);

    @Select("Select count(id) from photographer where go_live = 'Y'")
    int getGoLiveCount();

    @Select("Select * from photographer where name like concat('%',#{keyword},'%') or nick_name like concat('%',#{keyword},'%')")
    List<Photographer> findByName(String keyword);

    @Select("Select * from photographer where id = #{phId}")
    Photographer findByPhId(Integer phId);
}




