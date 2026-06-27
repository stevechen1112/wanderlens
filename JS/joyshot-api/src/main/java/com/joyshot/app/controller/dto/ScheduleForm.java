package com.joyshot.app.controller.dto;

import lombok.Data;

/**
 * @author avery
 */
@Data
public class ScheduleForm {
    String year;
    String month;
    String[] daySlotChecked;
    Integer hourStart;
    Integer hourEnd;
    Integer phId;

    public Integer getMinValue(){
        return hourStart * 60;
    }
    public Integer getMaxValue(){
        return hourEnd * 60;
    }
    public String getSlotStartLabel(){
        return hourStart + ":00";
    }
    public String getSlotEndLabel(){
        return hourEnd + ":00";
    }
    public String getMonthLabel(){
        return (Integer.parseInt(month) < 10) ? "0"+month : month;
    }
    public String scheduleYYMM(){
        return year + "/" + getMonth()+"/";
    }



}
