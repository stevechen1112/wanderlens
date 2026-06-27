package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.PhotographerFeature;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【photographer_feature】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerFeature
*/
public interface PhotographerFeatureMapper extends BaseMapper<PhotographerFeature> {

   List<PhotographerFeature> selectFeatureByPid(Integer phId);


}




