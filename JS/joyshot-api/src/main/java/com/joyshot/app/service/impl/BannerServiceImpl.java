package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Banner;
import com.joyshot.app.service.BannerService;
import com.joyshot.app.mapper.BannerMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【banner】的資料庫操作Service实现
*/
@Service
public class BannerServiceImpl extends ServiceImpl<BannerMapper, Banner>
    implements BannerService{

}




