package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Date;

import lombok.Data;

/**
 *
 * @TableName order
 */
@TableName(value ="js_order")
@Data
public class Order implements Serializable {


    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 訂單編號
     */
    private String orderNo;

    /**
     * 攝影師id
     */
    private String phUuid;

    /**
     * 客戶id
     */
    private Integer custId;

    /**
     * 服務類型
     */
    private String serviceCat;
    private String serviceCatEn;
    private String serviceCatJp;
    private String serviceCatKr;

    /**
     * 拍攝費
     */
    private Integer serviceFee;

    /**
     * 每個人的單價
     */
    private Integer unitPrice;

    /**
     * 總交通費
     */
    private Integer transportationFee;

    /**
     * 客戶應負擔的交通費
     */
    private Integer transportationFeeOnCustomer;

    /**
     * 客戶實際負擔的交通費
     */
    private Integer transportationFeeCustomerActualPay;


    /**
     * coupon
     */
    private String couponCode;

    /**
     * 折扣金額
     */
    private Integer couponDiscount;

    /**
     * 總費用
     */
    private Integer totalFee;

    /**
     * 客戶姓名
     */
    private String customerName;

    /**
     * 客戶電話
     */
    private String customerPhone;

    /**
     * 方便連絡的時間
     */
    private String contactTime;

    /**
     * 拍攝日期
     */
    private String shootingDate;

    /**
     * 拍攝時間
     */
    private String shootingTime;

    /**
     * 拍攝時數
     */
    private Double shootingDuration;

    /**
     * 拍攝地點
     */
    private String shootingLocation;

    /**
     * 大人人數
     */
    private Integer adultNum;

    /**
     * 小孩人員
     */
    private Integer childNum;

    /**
     * 是否有寵物
     */
    private Integer hasPets;

    /**
     * 寵物註記
     */
    private String petsNotes;

    /**
     * 聯盟推薦人
     */
    private Integer affiliateBy;

    /**
     * 交通距離
     */
    private Double distance;

    /**
     * 支付攝影師費
     */
    private Integer photographerProfit;

    /**
     * 交通費付擔比例
     */
    private Double ratioOnCustomer;

    /**
     * email
     */
    private String email;

    /**
     * 客戶來自
     */
    private String customerCity;

    /**
     * 聯絡管道
     */
    private String social;

    /**
     * 社群帳號
     */
    private String socialAccount;

    /**
     * 訂單備註
     */
    private String extraInfo;

    /**
     * 訂單狀態
     */
    private String status;


    /**
     * 刷卡方式
     */
    private String paymentMethod;

    /**
     * 刷卡訂單編號
     */
    private String paymentOrderNo;

    private String rtnCode;

    private String driverLink;
    private String manualOrder;
    private Integer picNum;
    private String backupDone;

    @TableField(exist = false)
    private String notes;



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

    public Integer getTotal() {
//        return getServiceFee() + getTransportationFeeOnCustomer();
        return getServiceFee() + getTransportationFeeCustomerActualPay();
    }

    @TableField(exist = false)
    private Photographer photographer;

    @TableField(exist = false)
    private PhotographerBank photographerBank;

    @TableField(exist = false)
    private Affiliate couponOwner;

    @TableField(exist = false)
    private String[] statusList = new String[] {"processing", "pay_failed", "pay_success", "contact", "uploaded", "confirm-uploaded", "transferred", "close"};

    public String getOrderStatus() {
        if ("processing".equals(status)) {
            return "尚未付款";
        } else if ("pay_success".equals(status)) {
            return "完成付款";
        } else if ("pay_failed".equals(status)) {
            return "付款失敗";
        } else if ("contact".equals(status)) {
            return "已聯繫";
        } else if ("uploaded".equals(status)) {
            return "照片已上傳";
        } else if ("confirm-uploaded".equals(status)) {
            return "已通知客戶看照片";
        } else if ("transferred".equals(status)) {
            return "已匯款給攝影師";
        } else if ("close".equals(status)) {
            return "結案";
        } else if ("cancel".equals(status)) {
            return "取消";
        } else if ("auto_cancel".equals(status)) {
            return "未付款取消";
        }
        return status;
    }

    public String getShootingPersons() {
        String persons = "";
        if (getAdultNum().intValue() == 99 || getAdultNum().intValue() >= 10) {
            persons += "超過10位大人, ";
        } else {
            persons += getAdultNum()+" 位大人, ";
        }

        if (getChildNum().intValue() == 99 || getChildNum().intValue() >= 10) {
            persons += "超過10位小孩, ";
        } else {
            persons += getChildNum()+" 位小孩, ";
        }

//        String persons = getAdultNum()+" 位大人, " + getChildNum() + " 位小孩, ";
        if (hasPets == 1) {
            persons += "攜帶的寵物：" + getPetsNotes();
        } else {
            persons += "無寵物";
        }
        return persons;
    }

    /**
     * 是否可上傳
     * @return
     */
    public boolean isUploadable() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("pay_success");
    }

    /**
     * 是否已聯繫客戶
     * @return
     */
    public boolean isFinishContact() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("contact");
    }

    /**
     * 是否已上傳照片
     * @return
     */
    public boolean isAfterUpload() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("uploaded");
    }

    /**
     * 是否已通知客戶看照片
     * @return
     */
    public boolean isConfirmUpload() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("confirm-uploaded");
    }

    /**
     * 是否已匯款給攝影師
     * @return
     */
    public boolean isAfterPayment() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("transferred");
    }

    /**
     * 攝影師是否已收款
     * @return
     */
    public boolean isPhotographerConfirmGetPaid() {
        return Arrays.asList(statusList).indexOf(status) >= Arrays.asList(statusList).indexOf("close");
    }



    public String getPayDate() {
        //convert String to LocalDate
        LocalDate shootingLocalDate = LocalDate.parse(getShootingDate(), DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        //取出 日 月
        int day = shootingLocalDate.getDayOfMonth();
        int month = shootingLocalDate.getMonthValue();

        String monthLabel = month + "";
        if (month < 10) {
            monthLabel = "0" + month;
        }

        if (day >= 1 && day <= 10) {
            //當月15日
//            System.out.println(getOrderNo() + ":" + shootingLocalDate.getYear() + "/" + monthLabel + "/15");
            return shootingLocalDate.getYear() + "/" + monthLabel + "/15";
        } else if (day >= 11 && day <= 20) {
            //當月25日
//            System.out.println(getOrderNo() + ":" + shootingLocalDate.getYear() + "/" + monthLabel + "/25");
            return shootingLocalDate.getYear() + "/" + monthLabel + "/25";
        } else {
            //次月5日
            if (month == 12) {
                //次年
//                System.out.println(getOrderNo() + ":" + (shootingLocalDate.getYear()+1) + "/01/5");
                return (shootingLocalDate.getYear()+1) + "/" + "01/05";
            } else {
                if ((month+1) < 10) {
                    monthLabel = "0" + (month+1);
                } else {
                    monthLabel = (month+1) + "";
                }
//                System.out.println(getOrderNo() + ":" + shootingLocalDate.getYear() + "/" + (month+1) + "/5");
                return shootingLocalDate.getYear() + "/" + monthLabel + "/05";
            }
        }

    }





}
