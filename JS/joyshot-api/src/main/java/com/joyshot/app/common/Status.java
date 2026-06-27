package com.joyshot.app.common;

/**
 * @author avery
 */
public interface Status {
    String CODE_200 = "200";
    String CODE_500 = "500";
    String CODE_ERROR = "error";
    String VALIDATION_ERROR = "field_validation_error";
    String CODE_401 = "401";

    //請款單狀態
    String REQ_PAY_DRAFT = "草稿";
    String REQ_PAY_UNDER_REVIEW = "簽核中";
    String REQ_PAY_REJECT = "退回";
    String REQ_PAY_FINISH = "完成";

    //請購單狀態
    String REQ_BUY_DRAFT = "草稿";
    String REQ_BUY_UNDER_REVIEW = "簽核中";
    String REQ_BUY_REJECT = "退回";
    String REQ_BUY_FINISH = "完成";


}
