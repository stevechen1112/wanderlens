package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 訂單 Entity
 * 對應資料表: `order`
 */
@Data
@TableName("`order`")
public class Order {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 訂單編號（yyyyMMddHHmmssSS） */
    private String orderNo;

    /** 預約條件 ID */
    private Long bookingId;

    /** 消費者 ID */
    private Long consumerId;

    /** 攝影師 ID */
    private Long photographerId;

    /** 第二位攝影師 ID（雙機） */
    private Long secondPhotographerId;

    /** 造型師 ID（如適用） */
    private Long stylistId;

    /** 攝影棚 ID（如適用） */
    private Long studioId;

    /** 拍攝類型 ID */
    private Long serviceTypeId;

    /** 拍攝配置 ID */
    private Long configurationId;

    /** 拍攝費 */
    private Integer serviceFee;

    /** 每小時單價 */
    private Integer unitPrice;

    /** 交通費 */
    private Integer transportationFee;

    /** 折扣碼 */
    private String couponCode;

    /** 折扣金額 */
    private Integer couponDiscount;

    /** 加時費用 */
    private Integer extraTimeFee;

    /** 總費用 */
    private Integer totalFee;

    /** 攝影師應付 */
    private Integer photographerProfit;

    /** 訂單狀態（狀態機） */
    private String status;

    /** 付款方式 */
    private String paymentMethod;

    /** 綠界 TradeNo（退款用） */
    private String ecpayTradeNo;

    /** 客戶姓名 */
    private String customerName;

    /** 客戶電話 */
    private String customerPhone;

    /** Email */
    private String email;

    /** 拍攝日期 */
    private LocalDate shootingDate;

    /** 拍攝時間（如 "14:00-16:00"） */
    private String shootingTime;

    /** 拍攝時數 */
    private BigDecimal shootingDuration;

    /** 拍攝地點 */
    private String shootingLocation;

    /** 大人人數 */
    private Integer adultNum;

    /** 小孩人數 */
    private Integer childNum;

    /** 照片張數 */
    private Integer picNum;

    /** 是否為手動訂單 */
    private String manualOrder;

    /** 客源國 ISO 代碼 */
    private String sourceCountry;

    /** 推薦碼 */
    private String referralCode;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}