package com.joyshot.app.entity;

import lombok.Data;

/**
 * @author avery
 */
@Data
public class ScheduleDTO {
    private String scheduleDate;
    private String allSeats;
    private String reservedSeats;
}
