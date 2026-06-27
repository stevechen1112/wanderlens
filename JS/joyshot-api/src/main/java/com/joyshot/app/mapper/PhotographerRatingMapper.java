package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.PhotographerRating;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【photographer_rating】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerRating
*/
public interface PhotographerRatingMapper extends BaseMapper<PhotographerRating> {


    List<PhotographerRating> selectRatingByPid(@Param("phId") Integer phId);

    Page<PhotographerRating> selectLatest(IPage<PhotographerRating> page);

    @Select("Select count(*) from photographer_rating")
    Integer selectAll();
}




