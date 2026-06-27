package com.joyshot.app.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.joyshot.app.entity.AppFlow;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【app_flow】的資料庫操作Service
*/
public interface AppFlowService extends IService<AppFlow> {

    IPage<AppFlow> selectPage(IPage<AppFlow> page, String keyword);

    boolean saveAppFlow(AppFlow obj);
}
