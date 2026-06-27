package com.joyshot.app.service;

import com.joyshot.app.entity.Order;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.User;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
* @author avery
* @description【order】的資料庫操作Service
*/
public interface OrderService extends IService<Order> {

    Order createOrder(Order order);

    String ecpayCheckout(Integer orderId);

    void handlePaymentFail(HttpServletRequest request);

    void handlePaymentSuccess(HttpServletRequest request) throws IOException;

    boolean photoFinishUpload(Integer orderId);

    boolean photoConfirmUpload(Integer orderId);

    boolean paymentRemind(Integer orderId);

    boolean createSharedFolder(Integer orderId) throws IOException;

    void handlePayPalSuccess(String tradeNo, String invoiceId) throws IOException;

    void handlePayPalFail(String invoiceId);

    Order createPayPalOrder(Order order) throws IOException;

    Order createManualOrder(Order order, User execUser) throws IOException;

    boolean finishContact(Integer orderId);

    void contactRemind(Order order);

    boolean finishTransfer(Integer orderId);

    void notifyBillingManager(List<Order> orders, String tomorrow);

    void cancelOrder(Order order);

    Order cancelPhotographerOrder(Order order, User execUser);

    Order updatePost(Order order, User execUser);

    void remindNotUpload(List<Order> orders);
}
