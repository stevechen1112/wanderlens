package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.News;
import com.joyshot.app.service.NewsService;
import com.joyshot.app.mapper.NewsMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【news】的資料庫操作Service实现
*/
@Service
public class NewsServiceImpl extends ServiceImpl<NewsMapper, News>
    implements NewsService{

}




