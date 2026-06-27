package com.joyshot.app.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.Faq;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.ServiceCat;

/**
* @author avery
* @description【faq】的資料庫操作Service
*/
public interface FaqService extends IService<Faq> {

    Page<Faq> selectAll(IPage<Faq> page);

    Page<Faq> selectByPage(IPage<Faq> page, String lang);

}
