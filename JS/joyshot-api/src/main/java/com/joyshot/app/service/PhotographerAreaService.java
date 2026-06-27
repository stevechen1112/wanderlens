package com.joyshot.app.service;

import com.joyshot.app.controller.dto.ServiceAreaDTO;
import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.PhotographerArea;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author avery
* @description【photographer_area】的資料庫操作Service
*/
public interface PhotographerAreaService extends IService<PhotographerArea> {

    List<Area> getServiceArea(Integer pid);

    boolean saveAreaService(Integer pid, ServiceAreaDTO serviceAreaDTO);
}
