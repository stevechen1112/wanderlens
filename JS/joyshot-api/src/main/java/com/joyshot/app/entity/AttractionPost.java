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
 * @TableName attraction_post
 */
@TableName(value ="attraction_post")
@Data
public class AttractionPost implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 語系
     */
    private String language;

    /**
     * 景點所屬縣市
     */
    private Integer area;

    /**
     * 景點名稱
     */
    private String name;

    /**
     * 景點代表圖
     */
    private String imageUuid;

    /**
     * 景點介紹連結
     */
    private String postUrl;

    /**
     * 建立時間
     */
    private Date createdAt;

    /**
     * 修改時間
     */
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private String cityName;
    private String cityNameEn;
    private String cityNameJp;
    private String cityNameKr;
}
