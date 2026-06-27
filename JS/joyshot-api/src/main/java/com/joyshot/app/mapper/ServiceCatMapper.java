package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.ServiceCat;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.ServiceCategory;

import java.util.List;

/**
* @author avery
* @description【service_cat】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.ServiceCat
*/

public interface ServiceCatMapper extends BaseMapper<ServiceCat> {

    Page<ServiceCat> selectAll(IPage<ServiceCat> page);


    List<ServiceCat> selectServiceByServiceItem(String[] items);
}




