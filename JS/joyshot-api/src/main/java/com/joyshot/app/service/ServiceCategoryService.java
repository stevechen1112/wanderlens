package com.joyshot.app.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.ServiceCategory;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.ServiceCategoryForm;
import com.joyshot.app.entity.User;

/**
* @author avery
* @description【service_category】的資料庫操作Service
*/
public interface ServiceCategoryService extends IService<ServiceCategory> {

    public boolean addServiceCategory(ServiceCategory sc);

    Page<ServiceCategory> findAll(IPage<ServiceCategory> page, String locale);

    int deleteById(Integer id);

    boolean doSave(ServiceCategoryForm form, String locale, User execUser);

    boolean doUpdate(ServiceCategoryForm form, String locale, User execUser);
}
