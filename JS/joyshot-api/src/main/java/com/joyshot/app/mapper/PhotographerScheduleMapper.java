package com.joyshot.app.mapper;

import com.joyshot.app.entity.ScheduleDTO;
import com.joyshot.app.controller.dto.ScheduleForm;
import com.joyshot.app.entity.PhotographerSchedule;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
* @author avery
* @description【photographer_schedule】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerSchedule
*/
public interface PhotographerScheduleMapper extends BaseMapper<PhotographerSchedule> {

    boolean updateSchedule(ScheduleForm scheduleForm);

    @Delete("delete from photographer_schedule where id = #{id}")
    int deleteSchedule(Integer id);

    int batchDelete(@Param("scheduleList") List<PhotographerSchedule> scheduleList, @Param("phId")  Integer phId);

    boolean batchInsert(@Param("scheduleList")List<PhotographerSchedule> scheduleList, @Param("phId")  Integer phId);

    @Select("select * from photographer_schedule where ph_id = #{phId} and schedule_date like concat('%', #{monthFilter}, '%') order by schedule_date")
    List<PhotographerSchedule> getScheduleByMonth(Integer phId, String monthFilter);

    @Update("Update photographer_schedule set active = #{active} where ph_id = #{phId} and schedule_date = #{shootingDate}")
    void changeState(Integer phId, String shootingDate, String active);

    List<ScheduleDTO> getScheduleGroupByCity(String city, String yyyyMM);

    List<PhotographerSchedule> getPhotographerByDate(String scheduleDate, String city);

    List<PhotographerSchedule> findPhotographerSchedule(Integer phId, String today, String endDate);
}




