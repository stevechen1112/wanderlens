package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.controller.dto.ScheduleForm;
import com.joyshot.app.entity.PhotographerSchedule;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.service.PhotographerScheduleService;
import com.joyshot.app.mapper.PhotographerScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
* @author avery
* @description【photographer_schedule】的資料庫操作Service实现
*/
@Service
public class PhotographerScheduleServiceImpl extends ServiceImpl<PhotographerScheduleMapper, PhotographerSchedule>
    implements PhotographerScheduleService{

    @Autowired
    private PhotographerScheduleMapper photographerScheduleMapper;



    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean saveSchedule(Integer phId, ScheduleForm scheduleForm) {

        String[] daySlotChecked = scheduleForm.getDaySlotChecked();
        List<PhotographerSchedule> scheduleList = new ArrayList<>();

        for(String dayLabel : daySlotChecked) {
            String scheduleDate = scheduleForm.getYear() + "/" + scheduleForm.getMonthLabel() + "/" + dayLabel;
            System.out.println(scheduleDate);
            PhotographerSchedule schedule = new PhotographerSchedule();
            schedule.setPhId(phId);
            schedule.setSlotStart(scheduleForm.getHourStart());
            schedule.setSlotEnd(scheduleForm.getHourEnd());
            schedule.setSlotStartLabel(scheduleForm.getSlotStartLabel());
            schedule.setSlotEndLabel(scheduleForm.getSlotEndLabel());
            schedule.setMinValue(scheduleForm.getMinValue());
            schedule.setMaxValue(scheduleForm.getMaxValue());
            schedule.setScheduleDate(scheduleDate);
            scheduleList.add(schedule);

        }

        //先更新目前日期的設定，如果更新不到，則新增
        int count = photographerScheduleMapper.batchDelete(scheduleList, phId);
        System.out.println("刪除了:" + count + " 筆");
        boolean insertResult = photographerScheduleMapper.batchInsert(scheduleList, phId);


        return insertResult;
    }

    @Override
    public void getScheduleGroupByCity(String city, String year, String month) {

    }
}




