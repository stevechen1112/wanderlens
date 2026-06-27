package com.wanderlens.api.service;

import com.wanderlens.api.entity.Order;

import java.util.Map;

public interface PaymentService {

    /**
     * 取得訂單（供 Controller 驗證所有權用）
     */
    Order getOrderById(Long orderId);

    /**
     * 依訂單號取得訂單
     */
    Order getOrderByNo(String orderNo);

    /**
     * 產生綠界付款表單 HTML
     */
    String generateEcpayCheckout(Long orderId);

    /**
     * 處理綠界付款回呼
     */
    Order handlePaymentCallback(Map<String, String> callbackParams);

    /**
     * 檢查付款狀態
     */
    String checkPaymentStatus(String orderNo);

    /**
     * 退款
     */
    Order refund(Long orderId, String reason);

    /**
     * 加時即時付款
     */
    String generateExtraTimePayment(Long orderId, int amount);

    /**
     * Staging／Test 模式模擬付款成功（E2E 用）
     */
    Order simulateStagingPaymentSuccess(Long orderId);
}