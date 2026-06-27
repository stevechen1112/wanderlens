package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.ServiceCategory;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;

/**
* @author avery
* @description【service_category】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.ServiceCategory
*/
public interface ServiceCategoryMapper extends BaseMapper<ServiceCategory> {

    Page<ServiceCategory> findAll(IPage<ServiceCategory> page, String locale);

}




