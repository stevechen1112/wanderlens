package com.joyshot.app.mapper;

import com.joyshot.app.entity.ServiceCategoryLang;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;

/**
* @author avery
* @description【service_category_lang】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.ServiceCategoryLang
*/
public interface ServiceCategoryLangMapper extends BaseMapper<ServiceCategoryLang> {

    @Delete("delete from service_category_lang where service_category_id = #{serviceCategoryId}")
    int deleteByServiceCategoryId(Integer serviceCategoryId);
}




