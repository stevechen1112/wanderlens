package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.InstagramPost;
import com.joyshot.app.service.InstagramPostService;
import com.joyshot.app.mapper.InstagramPostMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【instagram_post】的資料庫操作Service实现
*/
@Service
public class InstagramPostServiceImpl extends ServiceImpl<InstagramPostMapper, InstagramPost>
    implements InstagramPostService{

}




