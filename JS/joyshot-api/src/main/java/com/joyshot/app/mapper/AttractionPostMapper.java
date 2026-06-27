package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.AttractionPost;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.GroupByDTO;
import org.apache.ibatis.annotations.Select;
import java.util.List;

/**
* @author avery
* @description【attraction_post】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.AttractionPost
*/
public interface AttractionPostMapper extends BaseMapper<AttractionPost> {

    Page<AttractionPost> selectByPage(IPage<AttractionPost> page, Integer areaId, String lang);

    List<GroupByDTO> selectGroupByType();

}
