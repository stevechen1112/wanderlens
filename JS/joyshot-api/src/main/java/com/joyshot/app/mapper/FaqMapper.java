package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.Faq;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

/**
* @author avery
* @description【faq】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Faq
*/
public interface FaqMapper extends BaseMapper<Faq> {

    @Select("Select * from faq")
    Page<Faq> selectAll(IPage<Faq> page);

    Page<Faq> selectByPage(IPage<Faq> page, String lang);

}
