package com.wanderlens.api.common;

import lombok.Getter;

/**
 * 結果碼定義
 */
@Getter
public enum ResultCode {

    // ── 成功 ──
    SUCCESS("200", "ok"),

    // ── 客戶端錯誤 ──
    BAD_REQUEST("400", "請求格式錯誤"),
    UNAUTHORIZED("401", "未認證"),
    FORBIDDEN("403", "無權限"),
    NOT_FOUND("404", "找不到資源"),
    FIELD_VALIDATION_ERROR("field_validation_error", "欄位驗證失敗"),

    // ── 伺服器錯誤 ──
    INTERNAL_ERROR("500", "伺服器內部錯誤"),

    // ── 業務錯誤 ──
    ORDER_NOT_FOUND("order_not_found", "訂單不存在"),
    ORDER_STATUS_INVALID("order_status_invalid", "訂單狀態不允許此操作"),
    PROVIDER_NOT_FOUND("provider_not_found", "供給方不存在"),
    PROVIDER_NOT_AVAILABLE("provider_not_available", "該時段不可預約"),
    SLOT_LOCKED("slot_locked", "時段已被鎖定"),
    PAYMENT_FAILED("payment_failed", "付款失敗"),
    PAYMENT_CALLBACK_INVALID("payment_callback_invalid", "付款回呼驗證失敗"),
    COUPON_INVALID("coupon_invalid", "折扣碼無效"),
    COUPON_EXPIRED("coupon_expired", "折扣碼已過期"),
    CONVERSATION_NOT_FOUND("conversation_not_found", "溝通室不存在"),
    CONVERSATION_READONLY("conversation_readonly", "溝通室已轉為唯讀"),
    ALBUM_NOT_FOUND("album_not_found", "相簿不存在"),
    NOTIFICATION_NOT_FOUND("notification_not_found", "通知不存在"),
    USER_NOT_FOUND("user_not_found", "使用者不存在"),
    RETOUCH_JOB_NOT_FOUND("retouch_job_not_found", "工單不存在"),
    SLOT_NOT_FOUND("slot_not_found", "時段不存在"),
    SERVICE_UNAUTHORIZED("service_unauthorized", "服務驗證失敗"),
    CONFLICT("409", "資源衝突"),
    MEDIA_VERIFY_FAILED("media_verify_failed", "媒體驗收失敗"),
    TOKEN_INVALID("token_invalid", "Token 無效或已過期"),
    ACCOUNT_DISABLED("account_disabled", "帳號已停用");

    private final String code;
    private final String message;

    ResultCode(String code, String message) {
        this.code = code;
        this.message = message;
    }
}