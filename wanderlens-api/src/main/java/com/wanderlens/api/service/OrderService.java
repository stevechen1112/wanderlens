package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.OrderHistory;
import com.wanderlens.api.entity.ShootEvent;
import com.wanderlens.api.entity.dto.CreateOrderRequest;
import com.wanderlens.api.entity.enums.OrderStatus;

import java.util.List;

public interface OrderService extends IService<Order> {

    /**
     * 建立訂單
     */
    Order createOrder(CreateOrderRequest request, Long consumerId);

    /**
     * 狀態機轉移（核心）
     */
    Order transition(Long orderId, OrderStatus toStatus, String action, String detail, String execBy);

    /**
     * 攝影師回報已聯繫
     */
    Order contactCustomer(Long orderId, Long providerId);

    /**
     * 攝影師確認待拍攝（Confirmed → ReadyToShoot）
     */
    Order confirmReadyToShoot(Long orderId, Long providerId);

    /**
     * 起拍
     */
    ShootEvent startShoot(Long orderId, Long providerId);

    /**
     * 結束拍攝
     */
    ShootEvent endShoot(Long orderId, Long providerId);

    /**
     * 加時申請
     */
    ShootEvent requestExtraTime(Long orderId, Long providerId, int minutes, int fee);

    /**
     * 消費者確認加時
     */
    Order confirmExtraTime(Long orderId, Long consumerId);

    int getLatestExtraTimeFee(Long orderId);

    /**
     * 取消訂單（分級退款）
     */
    Order cancelOrder(Long orderId, String reason, String execBy);

    /**
     * 重新媒合
     */
    Order rematch(Long orderId, String reason);

    /**
     * 取得訂單歷程
     */
    List<OrderHistory> getOrderHistory(Long orderId);

    /**
     * 取得拍攝事件（起拍/加時/結束）
     */
    List<ShootEvent> getShootEvents(Long orderId);

    /**
     * 依攝影師查訂單
     */
    List<Order> getProviderOrders(Long providerId);

    /**
     * 依消費者查訂單
     */
    List<Order> getConsumerOrders(Long consumerId);

    /**
     * 依消費者查訂單（分頁）
     */
    com.wanderlens.api.common.PageResult<Order> getConsumerOrdersPaged(Long consumerId, int page, int size);

    /**
     * 依狀態查訂單（後台，分頁）
     */
    com.wanderlens.api.common.PageResult<Order> getOrdersByStatusPaged(OrderStatus status, int page, int size);

    /**
     * 依狀態查訂單（後台）
     */
    List<Order> getOrdersByStatus(OrderStatus status);

    /**
     * 產生訂單編號
     */
    String generateOrderNo();

    /**
     * 補齊訂單回傳用攝影師名稱與 UUID
     */
    void enrichOrder(Order order);

    void enrichOrders(List<Order> orders);
}