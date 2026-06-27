package com.wanderlens.api.entity.enums;

import lombok.Getter;

import java.util.EnumSet;
import java.util.Set;

/**
 * 訂單狀態（17+ 狀態的完整狀態機）
 *
 * 狀態轉移圖：
 * Draft → PendingPayment → Paid → WaitingProviderContact → Confirmed → ReadyToShoot
 *   → ShootingStarted → ShootingEnded → UploadingRaw → AiProcessing → Delivered
 *   → RetouchRequested → Retouching → RetouchDelivered → Closed
 *   → Rematching / Rescheduled / Disputed / Refunded / Cancelled
 */
@Getter
public enum OrderStatus {

    // ── 主流程 ──
    DRAFT("Draft", "草稿"),
    PENDING_PAYMENT("PendingPayment", "待付款"),
    PAID("Paid", "已付款"),
    WAITING_PROVIDER_CONTACT("WaitingProviderContact", "等待攝影師聯繫"),
    CONFIRMED("Confirmed", "已確認"),
    READY_TO_SHOOT("ReadyToShoot", "待拍攝"),
    SHOOTING_STARTED("ShootingStarted", "拍攝中"),
    SHOOTING_ENDED("ShootingEnded", "拍攝結束"),
    UPLOADING_RAW("UploadingRaw", "RAW 上傳中"),
    AI_PROCESSING("AiProcessing", "AI 處理中"),
    DELIVERED("Delivered", "已交付"),

    // ── 精修流程 ──
    RETOUCH_REQUESTED("RetouchRequested", "精修已申請"),
    RETOUCHING("Retouching", "精修中"),
    RETOUCH_DELIVERED("RetouchDelivered", "精修已交付"),

    // ── 結案 ──
    CLOSED("Closed", "已結案"),

    // ── 例外流程 ──
    REMATCHING("Rematching", "重新媒合中"),
    RESCHEDULED("Rescheduled", "已改期"),
    DISPUTED("Disputed", "爭議中"),
    REFUNDED("Refunded", "已退款"),
    CANCELLED("Cancelled", "已取消");

    private final String code;
    private final String label;

    OrderStatus(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public static OrderStatus fromCode(String code) {
        for (OrderStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        throw new IllegalArgumentException("未知訂單狀態: " + code);
    }

    /**
     * 合法的狀態轉移
     * key = 當前狀態, value = 可轉移到的狀態集合
     */
    public static Set<OrderStatus> allowedTransitions(OrderStatus current) {
        return switch (current) {
            case DRAFT -> EnumSet.of(PENDING_PAYMENT, CANCELLED);
            case PENDING_PAYMENT -> EnumSet.of(PAID, CANCELLED);
            case PAID -> EnumSet.of(WAITING_PROVIDER_CONTACT, REMATCHING, CANCELLED);
            case WAITING_PROVIDER_CONTACT -> EnumSet.of(CONFIRMED, REMATCHING, DISPUTED, CANCELLED);
            case CONFIRMED -> EnumSet.of(READY_TO_SHOOT, RESCHEDULED, DISPUTED, CANCELLED);
            case READY_TO_SHOOT -> EnumSet.of(SHOOTING_STARTED, RESCHEDULED, DISPUTED, CANCELLED);
            case SHOOTING_STARTED -> EnumSet.of(SHOOTING_ENDED, DISPUTED);
            case SHOOTING_ENDED -> EnumSet.of(UPLOADING_RAW, DISPUTED);
            case UPLOADING_RAW -> EnumSet.of(AI_PROCESSING, DISPUTED);
            case AI_PROCESSING -> EnumSet.of(DELIVERED, DISPUTED);
            case DELIVERED -> EnumSet.of(RETOUCH_REQUESTED, CLOSED, DISPUTED);
            case RETOUCH_REQUESTED -> EnumSet.of(RETOUCHING, CLOSED);
            case RETOUCHING -> EnumSet.of(RETOUCH_DELIVERED, CLOSED);
            case RETOUCH_DELIVERED -> EnumSet.of(CLOSED);
            case REMATCHING -> EnumSet.of(WAITING_PROVIDER_CONTACT, CANCELLED);
            case RESCHEDULED -> EnumSet.of(READY_TO_SHOOT, CANCELLED);
            case DISPUTED -> EnumSet.of(CLOSED, REFUNDED);
            // 終態
            case CLOSED, REFUNDED, CANCELLED -> EnumSet.noneOf(OrderStatus.class);
        };
    }

    /**
     * 檢查狀態轉移是否合法
     */
    public static boolean canTransition(OrderStatus from, OrderStatus to) {
        return allowedTransitions(from).contains(to);
    }

    /**
     * 是否為終態
     */
    public static boolean isTerminal(OrderStatus status) {
        return status == CLOSED || status == REFUNDED || status == CANCELLED;
    }
}