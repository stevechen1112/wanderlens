package com.wanderlens.api.entity.dto;

import lombok.Data;

/**
 * 折扣碼驗證結果 DTO
 */
@Data
public class CouponResult {

    private Boolean valid;
    private String message;
    private Integer discount;
    private Integer newTotalFee;

    public static CouponResult success(Integer discount, Integer newTotalFee) {
        CouponResult r = new CouponResult();
        r.setValid(true);
        r.setMessage("折扣碼套用成功");
        r.setDiscount(discount);
        r.setNewTotalFee(newTotalFee);
        return r;
    }

    public static CouponResult fail(String message) {
        CouponResult r = new CouponResult();
        r.setValid(false);
        r.setMessage(message);
        return r;
    }
}