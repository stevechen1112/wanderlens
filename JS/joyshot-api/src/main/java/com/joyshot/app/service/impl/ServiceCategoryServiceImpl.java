package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.ServiceCategory;
import com.joyshot.app.entity.ServiceCategoryForm;
import com.joyshot.app.entity.ServiceCategoryLang;
import com.joyshot.app.entity.User;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.ServiceCategoryLangMapper;
import com.joyshot.app.service.ServiceCategoryService;
import com.joyshot.app.mapper.ServiceCategoryMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
* @author avery
* @description【service_category】的資料庫操作Service实现
*/
@Service
public class ServiceCategoryServiceImpl extends ServiceImpl<ServiceCategoryMapper, ServiceCategory>
    implements ServiceCategoryService{

    @Autowired
    public ServiceCategoryMapper serviceCategoryMapper;

    @Autowired
    public ServiceCategoryLangMapper serviceCategoryLangMapper;

    @Transactional(rollbackFor = {ServiceException.class})
    @Override
    public boolean addServiceCategory(ServiceCategory sc) {

        sc.setFileId(12345);
        serviceCategoryMapper.insert(sc);
        System.out.println(sc.getId());

        ServiceCategoryLang lang = new ServiceCategoryLang();
        lang.setServiceCategoryId(sc.getId());
        lang.setName("旅行");
        lang.setDescription("旅行紀錄");
        lang.setLang("zh");
        int result = serviceCategoryLangMapper.insert(lang);
        System.out.println(lang.getId());

        return result > 0;
    }

    @Override
    public Page<ServiceCategory> findAll(IPage<ServiceCategory> page, String locale) {
        return serviceCategoryMapper.findAll(page, locale);
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public int deleteById(Integer serviceCategoryId) {
        int result = serviceCategoryMapper.deleteById(serviceCategoryId);
        if (result > 0) {
            result = serviceCategoryLangMapper.deleteByServiceCategoryId(serviceCategoryId);
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean doSave(ServiceCategoryForm form, String locale, User execUser) {
        ServiceCategory sc = new ServiceCategory();
        sc.setFileId(form.getFileId());
        sc.setCreatedBy(execUser.getId());
        int result = serviceCategoryMapper.insert(sc);
        if (result > 0) {
            System.out.println(sc.getId());
            ServiceCategoryLang lang = new ServiceCategoryLang();
            lang.setServiceCategoryId(sc.getId());
            lang.setName(form.getName());
            lang.setDescription(form.getDescription());
            lang.setLang(locale);
            result = serviceCategoryLangMapper.insert(lang);
            return result > 0;
        } else {
            return false;
        }
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean doUpdate(ServiceCategoryForm form, String locale, User execUser) {
        ServiceCategory sc = new ServiceCategory();
        sc.setId(form.getId());
        sc.setFileId(form.getFileId());
        boolean updateSuccess = this.saveOrUpdate(sc);
        if (updateSuccess) {
            ServiceCategoryLang lang = new ServiceCategoryLang();
            lang.setId(form.getLangId());
            lang.setServiceCategoryId(sc.getId());
            lang.setName(form.getName());
            lang.setDescription(form.getDescription());
//            int i = serviceCategoryLangMapper.update();
//            updateSuccess = i > 0;
        }
        return updateSuccess;
    }
}




