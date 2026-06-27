package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 供給方 Entity（攝影師/造型師/攝影棚）
 * 對應資料表: provider
 */
@Data
@TableName("provider")
public class Provider {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** UUID（前台用） */
    private String providerUuid;

    /** 供給方類型（PHOTOGRAPHER/STYLIST/STUDIO） */
    private String providerType;

    /** 姓名/名稱 */
    private String name;

    /** 暱稱 */
    private String nickName;

    /** 暱稱（英） */
    private String nickNameEn;

    /** 暱稱（日） */
    private String nickNameJp;

    /** 暱稱（韓） */
    private String nickNameKr;

    /** 電話 */
    private String phone;

    /** Email */
    private String email;

    /** 縣市 */
    private String city;

    /** 鄉鎮區 */
    private String districtName;

    /** 地址 */
    private String address;

    /** 經度 */
    private Double addrLng;

    /** 緯度 */
    private Double addrLat;

    /** 大頭照 URL */
    private String avatar;

    /** 代表圖 URL */
    private String bannerImg;

    /** 介紹 */
    private String intro;

    /** 介紹（英） */
    private String introEn;

    /** 介紹（日） */
    private String introJp;

    /** 介紹（韓） */
    private String introKr;

    /** 評價 */
    private BigDecimal rating;

    /** 上架狀態（Y/N） */
    private String goLive;

    /** 服務項目（逗號分隔 ID） */
    private String serviceItem;

    /** 違規次數 */
    private Integer violationCount;

    /** 違規等級（NONE/WARNING/SUSPENDED/PERMANENT_BAN） */
    private String violationLevel;

    /** 暫停接案到期時間 */
    private LocalDateTime suspendedUntil;

    /** 審核狀態（PENDING/APPROVED/REJECTED） */
    private String reviewStatus;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}