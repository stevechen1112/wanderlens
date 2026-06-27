package com.joyshot.app.service;

import com.joyshot.app.entity.PhotographerWorks;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【photographer_works】的資料庫操作Service
*/
public interface PhotographerWorksService extends IService<PhotographerWorks> {

    boolean deleteWorkById(Integer id);
}
