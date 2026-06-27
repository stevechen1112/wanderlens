package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName coupon
 */
@TableName(value ="coupon")
@Data
public class Coupon implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 折扣名稱
     */
    private String couponName;

    /**
     * 折扣碼
     */
    private String couponCode;

    /**
     * 折扣金額
     */
    private Integer discount;

    /**
     * 開始時間
     */
    private String dateStart;

    /**
     * 結束時間
     */
    private String dateEnd;

    /**
     * 使用次數
     */
    private Integer usageCount;

    /**
     * 目前已使用次數
     */
    private Integer usageCountCurrent;

    /**
     * 使用最低金額
     */
    private Integer usagePrice;

    /**
     * 服務項目
     */
    private String usageService;

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
     * 團媽
     */
    private String couponOwner;

    @TableField(exist = false)
    private Affiliate affiliateOwner;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
