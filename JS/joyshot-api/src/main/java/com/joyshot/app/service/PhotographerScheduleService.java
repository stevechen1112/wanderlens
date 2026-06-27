package com.joyshot.app.service;

import com.joyshot.app.controller.dto.ScheduleForm;
import com.joyshot.app.entity.PhotographerSchedule;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【photographer_schedule】的資料庫操作Service
*/
public interface PhotographerScheduleService extends IService<PhotographerSchedule> {

    boolean saveSchedule(Integer pid, ScheduleForm scheduleForm);

    void getScheduleGroupByCity(String city, String year, String month);
}
