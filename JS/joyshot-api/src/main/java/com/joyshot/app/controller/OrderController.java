package com.joyshot.app.controller;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.controller.dto.PicNumDTO;
import com.joyshot.app.controller.dto.SmsDTO;
import com.joyshot.app.entity.*;
import com.joyshot.app.mapper.OrderHistoryMapper;
import com.joyshot.app.mapper.OrderMapper;
import com.joyshot.app.mapper.PhotographerFeatureMapper;
import com.joyshot.app.mapper.PhotographerMapper;
import com.joyshot.app.service.OrderService;
import com.joyshot.app.service.PhotographerService;
import com.joyshot.app.util.GdriverUtil;
import com.joyshot.app.util.MailUtil;
import ecpay.payment.integration.AllInOne;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/order")
public class OrderController extends AppBaseController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderHistoryMapper orderHistoryMapper;


    @PostMapping()
    public Result savePost(@RequestBody Order order) {
        Order result = orderService.createOrder(order);
        return (result != null) ? Result.success(order) : Result.error(Status.CODE_ERROR, "save_order_failed");
    }

    @PostMapping("/update")
    public Result updatePost(@RequestBody Order order, HttpServletRequest request) {
        User execUser = getExecUser(request);
        Order result = orderService.updatePost(order, execUser);
        return (result != null) ? Result.success(order) : Result.error(Status.CODE_ERROR, "save_order_failed");
    }

    @PostMapping("/cancel")
    public Result cancelOrder(@RequestBody Order order, HttpServletRequest request) {
        User execUser = getExecUser(request);
        Order result = orderService.cancelPhotographerOrder(order, execUser);
        return (result != null) ? Result.success(order) : Result.error(Status.CODE_ERROR, "cancel_order_failed");
    }

    @GetMapping("/history")
    public Result getOrderHistory(@RequestParam String orderNo) {
        List<OrderHistory> result = orderHistoryMapper.getHistoryByOrderNo(orderNo);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_history_failed");
    }

    @PostMapping("/paypal-order")
    public Result createPayPalOrder(@RequestBody Order order) throws IOException {
        Order result = orderService.createPayPalOrder(order);
        return (result != null) ? Result.success(order) : Result.error(Status.CODE_ERROR, "save_order_failed");
    }

    @PostMapping("/manual-order")
    public Result createManualOrder(@RequestBody Order order, HttpServletRequest request) throws IOException {
        User execUser = getExecUser(request);
        Order result = orderService.createManualOrder(order, execUser);
        return (result != null) ? Result.success(order) : Result.error(Status.CODE_ERROR, "save_order_failed");
    }

    @GetMapping("/all")
    public Result selectByPage(@RequestParam Integer pageNum,
                            @RequestParam Integer pageSize,
                            @RequestParam String queryField,
                            @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectByPage(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_order_failed");
    }

    @GetMapping("/has-coupon")
    public Result selectOrderHasCoupon(@RequestParam Integer pageNum,
                               @RequestParam Integer pageSize,
                               @RequestParam String queryField,
                               @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectOrderHasCoupon(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_order_failed");
    }

    @GetMapping("/myorder")
    public Result myorder(@RequestParam Integer pageNum,
                               @RequestParam Integer pageSize,
                               @RequestParam String queryField,
                               @RequestParam String keyword,
                               @RequestParam Integer pId) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectMyOrder(page, queryField, keyword, pId);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_myorder_failed");
    }

    /**
     * 取得狀態為照片已上傳的訂單
     * @param pageNum
     * @param pageSize
     * @param queryField
     * @param keyword
     * @return
     */
    @GetMapping("/status/uploaded")
    public Result uploadedOrder(@RequestParam Integer pageNum,
                          @RequestParam Integer pageSize,
                          @RequestParam String queryField,
                          @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectUploadedOrder(page, queryField, keyword, "uploaded");
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_myorder_failed");
    }

    /**
     * 取得狀態為未付款的訂單
     * @param pageNum
     * @param pageSize
     * @param queryField
     * @param keyword
     * @return
     */
    @GetMapping("/status/processing")
    public Result processingOrder(@RequestParam Integer pageNum,
                                @RequestParam Integer pageSize,
                                @RequestParam String queryField,
                                @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectProcessingOrder(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_processing_failed");
    }

    /**
     * 取得狀態為付款成功的訂單
     * @param pageNum
     * @param pageSize
     * @param queryField
     * @param keyword
     * @return
     */
    @GetMapping("/status/pay_success")
    public Result paySuccessOrder(@RequestParam Integer pageNum,
                                  @RequestParam Integer pageSize,
                                  @RequestParam String queryField,
                                  @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectPaySuccessOrder(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_processing_failed");
    }

    /**
     * 取得結案的訂單
     * @param pageNum
     * @param pageSize
     * @param queryField
     * @param keyword
     * @return
     */
    @GetMapping("/status/close")
    public Result closedOrder(@RequestParam Integer pageNum,
                                  @RequestParam Integer pageSize,
                                  @RequestParam String queryField,
                                  @RequestParam String keyword) {
        IPage<Order> page = new Page<>(pageNum, pageSize);
        Page<Order> result = orderMapper.selectClosedOrder(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_processing_failed");
    }

    @GetMapping("/info/{tradeNo}")
    public Result findByTradeNo(@PathVariable String tradeNo) {
        Order order = orderMapper.findByTradeNo(tradeNo);
        return Result.success(order);
    }

    @GetMapping("/ecpayCheckout")
    public Result ecpayCheckout(@RequestParam Integer orderId) {
        String aioCheckOutALLForm = orderService.ecpayCheckout(orderId);
        return Result.success(aioCheckOutALLForm);
    }

    /**
     * 綠界交易後 server side的call back
     * @param request
     * @param response
     * @throws IOException
     * @throws IOException
     */
    @PostMapping("/paid")
    public void ecpayCheckoutPaid(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PrintWriter out = response.getWriter();
        System.out.println("RtnCode:" + request.getParameter("RtnCode"));
        System.out.println("RtnMsg:" + request.getParameter("RtnMsg"));

        Enumeration<String> parameterNames = request.getParameterNames();
        Hashtable<String, String> dict = new Hashtable<>();
        while (parameterNames.hasMoreElements()) {
            String s = parameterNames.nextElement();
            System.out.println( s + "=" + request.getParameter(s));
            dict.put(s, request.getParameter(s));
        }

        if ("1".equals(request.getParameter("RtnCode"))) {
            System.out.println("訂單付款成功，檢查MacValue");

            AllInOne all = new AllInOne("");
            if ( all.compareCheckMacValue(dict) ) {
                System.out.println("check mac ok");
                orderService.handlePaymentSuccess(request);

                //更新訂單狀態+通知
                out.println("1|OK");

            } else {
                System.out.println("check mac not ok");
            }
        } else {
            System.out.println("訂單付款失敗:" + request.getParameter("RtnMsg"));
            orderService.handlePaymentFail(request);
        }
    }

    @GetMapping("/paypal-paid")
    public Result paypalPaid(@RequestParam String tradeNo, @RequestParam String invoiceId) throws IOException {
        orderService.handlePayPalSuccess( tradeNo,  invoiceId);
        return null;
    }

    @GetMapping("/paypal-failed")
    public Result paypalFailed(@RequestParam String invoiceId) throws IOException {
        orderService.handlePayPalFail(invoiceId);
        return null;
    }

    /**
     *
     * @param orderNo - 實際上是由　id+order_no　組成，用兩個欄位組合，主要是避免讓人直接在網址猜參數規則
     * @return
     */
    @GetMapping("/check/paid/{orderNo}")
    public Result orderPaid(@PathVariable String orderNo)  {
        Order order = orderMapper.findOrderByOrderNo(orderNo);
        System.out.println("目前訂單狀態:" + order.getStatus());
        return "pay_success".equals(order.getStatus()) ? Result.success(order.getOrderNo()) : Result.error(Status.CODE_ERROR, order.getId()+"");
    }

    @PostMapping("/photo/uploaded/{orderId}")
    public Result photoFinishUpload(@PathVariable Integer orderId)  {
        boolean result = orderService.photoFinishUpload(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "photo_finish_upload_failed");
    }

    @PostMapping("/photo/uploaded/pic-num")
    public Result savePicNum(@RequestBody PicNumDTO picNumDTO)  {
        boolean result = orderMapper.savePicNum(picNumDTO.getOrderId(), picNumDTO.getPicNum());
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "photo_save_pic_num_failed");
    }

    @PostMapping("/pay/transferred/{orderId}")
    public Result payTransfer(@PathVariable Integer orderId)  {
        boolean result = orderService.finishTransfer(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "匯款通知_failed");
    }

    @GetMapping("/photo/confirm-uploaded/{orderId}")
    public Result photoConfirmUpload(@PathVariable Integer orderId)  {
        boolean result = orderService.photoConfirmUpload(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "photo_confirm_upload_failed");
    }

    @GetMapping("/payment/remind/{orderId}")
    public Result paymentRemind(@PathVariable Integer orderId)  {
        boolean result = orderService.paymentRemind(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "payment_remind_failed");
    }

    /**
     * 回報已聯繫
     * @param orderId
     * @return
     */
    @PostMapping("/contact/customer/{orderId}")
    public Result finishContact(@PathVariable Integer orderId)  {
        boolean result = orderService.finishContact(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "contact_customer_failed");
    }

    @GetMapping("/create/folder/{orderId}")
    public Result createSharedFolder(@PathVariable Integer orderId) throws IOException {
        boolean result = orderService.createSharedFolder(orderId);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "create_folder_failed");
    }

    @GetMapping("/statistic/customer_count")
    public Result getCustomerCount() throws IOException {
        Integer result = orderMapper.getCustomerCount();
        return result != null ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_order_statistic_error");
    }

    @GetMapping("/statistic/order_count")
    public Result getOrderCount() throws IOException {
        Integer result = orderMapper.getOrderCount();
        return result != null ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_order_statistic_error");
    }

    @GetMapping("/statistic/order_sum")
    public Result getOrderSum() throws IOException {
        Integer result = orderMapper.getOrderSum();
        return result != null ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_order_statistic_error");
    }

}
