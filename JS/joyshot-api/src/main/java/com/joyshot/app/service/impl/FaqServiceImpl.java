package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Faq;
import com.joyshot.app.service.FaqService;
import com.joyshot.app.mapper.FaqMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【faq】的資料庫操作Service实现
*/
@Service
public class FaqServiceImpl extends ServiceImpl<FaqMapper, Faq>
    implements FaqService{

    @Autowired
    private FaqMapper faqMapper;

    @Override
    public Page<Faq> selectAll(IPage<Faq> page) {
        return faqMapper.selectAll(page);
    }

    @Override
    public Page<Faq> selectByPage(IPage<Faq> page, String lang) {
        return faqMapper.selectByPage(page, lang);
    }

}
