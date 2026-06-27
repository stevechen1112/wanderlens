package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.ServiceCat;
import com.joyshot.app.entity.ServiceCategory;
import com.joyshot.app.service.ServiceCatService;
import com.joyshot.app.mapper.ServiceCatMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* @author avery
* @description【service_cat】的資料庫操作Service实现
*/
@Service
public class ServiceCatServiceImpl extends ServiceImpl<ServiceCatMapper, ServiceCat>
    implements ServiceCatService{

    @Autowired
    private ServiceCatMapper serviceCatMapper;

    @Override
    public List<ServiceCat> selectServiceByServiceItem(String serviceItem) {

        return null;
    }
}




