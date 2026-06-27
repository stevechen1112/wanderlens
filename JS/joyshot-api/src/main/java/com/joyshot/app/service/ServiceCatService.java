package com.joyshot.app.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.PhotographerWorks;
import com.joyshot.app.entity.ServiceCat;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.ServiceCategory;

import java.util.List;

/**
* @author avery
* @description【service_cat】的資料庫操作Service
*/

public interface ServiceCatService extends IService<ServiceCat> {

    List<ServiceCat>  selectServiceByServiceItem(String serviceItem);

}
