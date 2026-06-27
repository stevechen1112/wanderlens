package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.PhotographerWorks;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【photographer_works】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerWorks
*/
public interface PhotographerWorksMapper extends BaseMapper<PhotographerWorks> {


    List<PhotographerWorks> selectWorksByPid(Integer phId);


}




