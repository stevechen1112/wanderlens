package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 折扣碼 Entity
 * 對應資料表: coupon
 */
@Data
@TableName("coupon")
public class Coupon {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String couponName;

    private String couponCode;

    /** 折扣金額 */
    private Integer discount;

    private LocalDate dateStart;

    private LocalDate dateEnd;

    /** 可使用次數 */
    private Integer usageCount;

    /** 已使用次數 */
    private Integer usageCountCurrent;

    /** 低消金額 */
    private Integer usagePrice;

    /** 適用服務類型（逗號分隔 ID） */
    private String usageService;

    /** 折扣碼擁有者（推廣員 ID） */
    private Long couponOwner;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}