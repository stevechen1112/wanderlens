package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName photographer_schedule
 */
@TableName(value ="photographer_schedule")
@Data
public class PhotographerSchedule implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 攝影師id
     */
    private Integer phId;

    /**
     * 日期
     */
    private String scheduleDate;

    /**
     * 服務開始時間
     */
    private Integer slotStart;
    private String slotStartLabel;

    /**
     * 服務結束時間
     */
    private Integer slotEnd;
    private String slotEndLabel;

    /**
     * 服務時間轉成分數
     */
    private Integer minValue;
    private Integer maxValue;


    /**
     * 建立時間
     */
    private Date createdAt;

    /**
     * 修改時間
     */
    private Date modifiedAt;

    /**
     * 此時段是否可選
     */
    private String active;

    @TableField(exist = false)
    private Photographer photographer;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
