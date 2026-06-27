package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName search_criteria
 */
@TableName(value ="search_criteria")
@Data
public class SearchCriteria implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     *
     */
    private String queryid;

    /**
     * 指定攝影師
     */
    private String reserved;

    /**
     * 所選服務
     */
    private Integer queryService;

    /**
     * 挑選日期
     */
    private String queryDate;

    /**
     * 拍攝時段-時
     */
    private Integer queryHour;

    /**
     * 拍攝時段-分
     */
    private Integer queryMinute;

    /**
     * 拍攝時數
     */
    private Double queryDuration;

    /**
     * 大人人數
     */
    private Integer adults;

    /**
     * 小孩人數
     */
    private Integer children;

    /**
     * 是否有寵物
     */
    private Integer checkpets;

    /**
     * 寵物備註
     */
    private String petsnote;

    /**
     * 地點id
     */
    private String queryPlaceId;

    /**
     * 地點名
     */
    private String queryPlaceName;

    /**
     * 地址
     */
    private String queryLocation;

    /**
     * 縣市
     */
    private String city;

    /**
     * 鄉鎮區
     */
    private String cityArea;

    /**
     *
     */
    private Double lat;

    /**
     *
     */
    private Double lng;

    /**
     * 指定攝影師名字
     */
    private String queryAssignPhotographer;

    /**
     * 指定攝影師uuid
     */
    private String queryAssignPhUuid;

    /**
     * 查詢人員
     */
    private String searchBy;

    /**
     * 建立時間
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 修改時間
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
