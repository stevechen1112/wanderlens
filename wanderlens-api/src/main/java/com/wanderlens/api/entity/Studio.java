package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 攝影棚 Entity
 * 對應資料表: studio
 *
 * 與 Provider 不同：攝影棚是場地資源，非攝影師個人資產。
 * 有獨立的檔期、地點、棚型、環境照。
 */
@Data
@TableName("studio")
public class Studio {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String studioUuid;

    /** 棚名 */
    private String name;

    /** 棚型（人像棚/商品棚/綜合棚） */
    private String studioType;

    private String phone;
    private String email;

    /** 縣市 */
    private String city;
    private String districtName;
    private String address;
    private Double addrLng;
    private Double addrLat;

    /** 環境照 URL（逗號分隔） */
    private String environmentImages;

    /** 可容納服務類型（逗號分隔 ID） */
    private String supportedServiceTypes;

    /** 每小時價格 */
    private Integer hourlyRate;

    /** 上架狀態 Y/N */
    private String goLive;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}