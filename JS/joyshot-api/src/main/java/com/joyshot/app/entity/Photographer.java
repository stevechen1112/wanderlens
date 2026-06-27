package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 *
 * @TableName photographer
 */
@TableName(value ="photographer")
@Data
public class Photographer implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    private String phUuid;

    /**
     * 姓名
     */
    private String name;

    /**
     * 藝名
     */
    private String nickName;
    private String nickNameEn;
    private String nickNameJp;
    private String nickNameKr;

    /**
     * 聯絡電話
     */
    private String phone;

    /**
     * email
     */
    private String email;

    /**
     * 住家所在縣市
     */
    private String city;

    @TableField(exist = false)
    private String cityEn;

    @TableField(exist = false)
    private String cityJp;

    @TableField(exist = false)
    private String cityKr;

    /**
     * 縣市id
     */
    private Integer cityId;

    /**
     * 縣市底下的鄉鎮區名稱
     */
    private String districtName;

    /**
     * 鄉鎮區id
     */
    private Integer districtId;

    /**
     * 住家地址
     */
    private String address;


    /**
     * 住家地址的經度
     */
    private Double addrLng;

    /**
     * 住家地址的緯度
     */
    private Double addrLat;

    /**
     * 大頭照
     */
    private String avatar;

    /**
     * 代表圖
     */
    private String bannerImg;

    /**
     * 攝影師介紹
     */
    private String intro;
    private String introEn;
    private String introJp;
    private String introKr;

    /**
     * 顆星評價
     */
    private Double rating;


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

    /**
     *
     */
    private Integer isDeleted;

    /**
     *
     */
    private String goLive;

    private String career;
    private String experience;

    public boolean isGoLiveOn(){
        return "Y".equals(goLive);
    }

    /**
     * 服務項目
     */
    private String serviceItem;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private Order order;

    @TableField(exist = false)
    private PhotographerFeature[] feature;

    @TableField(exist = false)
    private PhotographerRating[] ratings;

    @TableField(exist = false)
    private PhotographerWorks[] works;

    @TableField(exist = false)
    private List<ServiceCat> serviceCats;

    /**
     * 訂單數
     */
    @TableField(exist = false)
    private Order[] bookings;

}
