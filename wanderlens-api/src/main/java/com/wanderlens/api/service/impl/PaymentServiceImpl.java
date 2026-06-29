package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.ConversationService;
import com.wanderlens.api.service.LedgerService;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * 綠界 ECPay 支付服務實作
 *
 * 注意：此為框架實作，實際的 CheckMacValue 綁碼需引入綠界 SDK 或自行實作 SHA256 綁碼。
 * JS 專案已有完整綠界 SDK 可參考（ecpay.payment.integration 套件）。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderService orderService;
    private final NotifyService notifyService;
    private final ConversationService conversationService;
    private final LedgerService ledgerService;

    @Value("${wanderlens.ecpay.merchant-id:}")
    private String merchantId;

    @Value("${wanderlens.ecpay.hash-key:}")
    private String hashKey;

    @Value("${wanderlens.ecpay.hash-iv:}")
    private String hashIv;

    @Value("${wanderlens.ecpay.return-url:http://localhost/api/payment/ecpay/callback}")
    private String returnUrl;

    @Value("${wanderlens.frontend.web:http://localhost:3001}")
    private String frontendWebUrl;

    @Value("${wanderlens.ecpay.mode:Test}")
    private String ecpayMode;

    @Value("${wanderlens.staging.payment-simulate-enabled:false}")
    private boolean stagingPaymentSimulateEnabled;

    @Override
    public Order getOrderById(Long orderId) {
        return orderService.getById(orderId);
    }

    @Override
    public Order getOrderByNo(String orderNo) {
        return orderService.getOne(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo));
    }

    @Override
    @Transactional
    public String generateEcpayCheckout(Long orderId) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        ensurePendingPaymentForCheckout(order);

        // 產生綠界 AioCheckOut 表單（含 CheckMacValue）
        return buildCheckoutForm(order.getOrderNo(), order.getTotalFee(),
                "攝影服務訂單 " + order.getOrderNo(), "WanderLens 攝影預約");
    }

    /**
     * 一般預約：Draft → PendingPayment（進入結帳時轉移）
     */
    private Order ensurePendingPaymentForCheckout(Order order) {
        if (OrderStatus.DRAFT.getCode().equals(order.getStatus())) {
            return orderService.transition(order.getId(), OrderStatus.PENDING_PAYMENT,
                    "CHECKOUT_INIT", "消費者進入付款頁", String.valueOf(order.getConsumerId()));
        }
        if (!OrderStatus.PENDING_PAYMENT.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID,
                    "訂單狀態無法付款，目前為 " + order.getStatus());
        }
        return order;
    }

    @Override
    @Transactional
    public Order handlePaymentCallback(Map<String, String> callbackParams) {
        String orderNo = callbackParams.get("MerchantTradeNo");
        String rtnCode = callbackParams.get("RtnCode");
        String tradeNo = callbackParams.get("TradeNo");

        // 驗證 CheckMacValue（SHA256 綁碼，防止偽造回呼）
        if (!verifyCheckMacValue(callbackParams)) {
            log.warn("綠界回呼 CheckMacValue 驗證失敗: orderNo={}", orderNo);
            throw new ServiceException(ResultCode.PAYMENT_CALLBACK_INVALID);
        }

        // 加時付款：MerchantTradeNo 以 EXT 開頭
        if (orderNo != null && orderNo.startsWith("EXT")) {
            return handleExtraTimePaymentCallback(orderNo, rtnCode, tradeNo);
        }

        Order order = orderService.getOne(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo));
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        // ── 冪等性檢查：已付款的訂單不重複處理 ──
        OrderStatus current = OrderStatus.fromCode(order.getStatus());
        if (current != OrderStatus.DRAFT && current != OrderStatus.PENDING_PAYMENT) {
            log.info("訂單已過付款階段，跳過重複回呼: orderNo={}, status={}", orderNo, order.getStatus());
            return order;
        }

        if ("1".equals(rtnCode)) {
            // 付款成功
            log.info("付款成功: orderNo={}, rtnCode={}", orderNo, rtnCode);

            if (tradeNo != null && !tradeNo.isEmpty()) {
                order.setEcpayTradeNo(tradeNo);
                orderService.updateById(order);
            }

            if (OrderStatus.DRAFT.getCode().equals(order.getStatus())) {
                order = orderService.transition(order.getId(), OrderStatus.PENDING_PAYMENT,
                        "PAYMENT_CALLBACK", "付款回呼補轉待付款", "ECPAY");
            }

            // 狀態轉移：PendingPayment → Paid → WaitingProviderContact
            order = orderService.transition(order.getId(), OrderStatus.PAID,
                    "PAYMENT_SUCCESS", "綠界付款成功 rtnCode=" + rtnCode, "ECPAY");
            order = orderService.transition(order.getId(), OrderStatus.WAITING_PROVIDER_CONTACT,
                    "AWAITING_CONTACT", "等待攝影師 24 小時內聯繫", "SYSTEM");

            // ── 付款成功後的完整流程 ──
            // 1. 觸發通知
            notifyService.triggerFlow("order_paid", order.getConsumerId(),
                    "付款成功", "訂單 " + orderNo + " 付款成功，攝影師將於 24 小時內聯繫您。");
            notifyService.triggerFlow("order_paid", order.getPhotographerId(),
                    "新訂單通知", "您有新訂單 " + orderNo + "，請於 24 小時內聯繫客戶。");

            // 2. 開啟站內溝通室（多人：消費者 + 攝影師 + 造型師）
            List<Long> participantIds = new java.util.ArrayList<>();
            List<String> userTypes = new java.util.ArrayList<>();
            participantIds.add(order.getConsumerId());
            userTypes.add("CONSUMER");
            participantIds.add(order.getPhotographerId());
            userTypes.add("PHOTOGRAPHER");
            if (order.getStylistId() != null) {
                participantIds.add(order.getStylistId());
                userTypes.add("STYLIST");
                notifyService.triggerFlow("order_paid", order.getStylistId(),
                        "新訂單通知", "您有新訂單 " + orderNo + "（造型服務），請於 24 小時內聯繫客戶。");
            }
            conversationService.openOrderConversation(order.getId(), participantIds, userTypes);

            // 3. 建立清算分錄
            ledgerService.createEntriesOnPayment(order.getId(), order.getTotalFee(), 0, order.getPhotographerProfit(), order.getPhotographerId());

        } else {
            // 付款失敗
            log.warn("付款失敗: orderNo={}, rtnCode={}", orderNo, rtnCode);
            order = orderService.transition(order.getId(), OrderStatus.CANCELLED,
                    "PAYMENT_FAILED", "綠界付款失敗 rtnCode=" + rtnCode, "ECPAY");
        }

        return order;
    }

    /**
     * 綠界 CheckMacValue SHA256 綁碼演算法：
     * 1. 排除 CheckMacValue 參數，其餘依參數名稱排序（TreeMap 自然排序）
     * 2. 以 `key=value` 用 `&` 串接
     * 3. 前後加上 HashKey / HashIV：`HashKey=xxx&...&HashIV=yyy`
     * 4. URL encode（小寫），再 SHA256 → 大寫 hex
     */
    private String computeCheckMacValue(Map<String, String> params) {
        TreeMap<String, String> sorted = new TreeMap<>(params);
        StringBuilder sb = new StringBuilder();
        sb.append("HashKey=").append(hashKey);
        for (Map.Entry<String, String> e : sorted.entrySet()) {
            sb.append("&").append(e.getKey()).append("=").append(e.getValue());
        }
        sb.append("&HashIV=").append(hashIv);
        String encoded = urlEncodeLowerCase(sb.toString());
        return sha256Hex(encoded).toUpperCase();
    }

    /**
     * 驗證回呼的 CheckMacValue：用回呼參數（排除 CheckMacValue 本身）重新計算後比對。
     */
    private boolean verifyCheckMacValue(Map<String, String> callbackParams) {
        String received = callbackParams.get("CheckMacValue");
        if (received == null || received.isEmpty()) {
            return false;
        }
        Map<String, String> paramsForCalc = new HashMap<>(callbackParams);
        paramsForCalc.remove("CheckMacValue");
        String computed = computeCheckMacValue(paramsForCalc);
        return computed.equals(received);
    }

    private static String urlEncodeLowerCase(String s) {
        // 綠界規格：URL encode 後轉小寫
        String encoded = URLEncoder.encode(s, StandardCharsets.UTF_8);
        // URLEncoder 將空白編為 +，綠界要求 %20
        encoded = encoded.replace("+", "%20");
        return encoded.toLowerCase();
    }

    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA256 計算失敗", e);
        }
    }

    @Override
    public String checkPaymentStatus(String orderNo) {
        Order order = orderService.getOne(new LambdaQueryWrapper<Order>()
                .eq(Order::getOrderNo, orderNo));
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        return order.getStatus();
    }

    @Override
    @Transactional
    public Order refund(Long orderId, String reason) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        // 驗證訂單狀態：只有已付款的訂單可以退款（拍攝中需先轉為爭議再退款）
        if (!OrderStatus.PAID.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID);
        }

        // 呼叫綠界 DoAction 退款（Action=R）
        if (order.getEcpayTradeNo() != null && !order.getEcpayTradeNo().isEmpty()) {
            invokeEcpayRefund(order.getOrderNo(), order.getEcpayTradeNo(), order.getTotalFee());
        } else {
            log.warn("訂單缺少 ecpayTradeNo，無法呼叫綠界退款 API: orderNo={}", order.getOrderNo());
            throw new ServiceException(ResultCode.PAYMENT_FAILED, "缺少綠界交易編號，無法退款");
        }
        log.info("退款申請: orderNo={}, reason={}", order.getOrderNo(), reason);

        // 狀態轉移至已退款
        Order refundedOrder = orderService.transition(orderId, OrderStatus.REFUNDED,
                "REFUND", reason, "ADMIN");

        // 通知雙方
        notifyService.triggerFlow("order_refunded", order.getConsumerId(),
                "退款通知", "訂單 " + order.getOrderNo() + " 已退款，原因：" + reason);
        notifyService.triggerFlow("order_refunded", order.getPhotographerId(),
                "退款通知", "訂單 " + order.getOrderNo() + " 已退款，原因：" + reason);

        return refundedOrder;
    }

    @Override
    public String generateExtraTimePayment(Long orderId, int amount) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        // 驗證訂單狀態：只有已付款或拍攝中的訂單可以加時
        if (!OrderStatus.PAID.getCode().equals(order.getStatus())
                && !OrderStatus.SHOOTING_STARTED.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID);
        }

        String extraTimeTradeNo = buildExtraTimeTradeNo(order.getId());
        log.info("產生加時付款表單: orderNo={}, extraTimeTradeNo={}, amount={}",
                order.getOrderNo(), extraTimeTradeNo, amount);

        return buildCheckoutForm(extraTimeTradeNo, amount,
                "加時費用 " + order.getOrderNo(), "WanderLens 加時付款");
    }

    private Order handleExtraTimePaymentCallback(String extraTradeNo, String rtnCode, String tradeNo) {
        // 格式 EXT{orderId}，例如 EXT42
        Long orderId;
        try {
            orderId = Long.parseLong(extraTradeNo.substring(3));
        } catch (NumberFormatException e) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND, "無效的加時交易編號");
        }
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if ("1".equals(rtnCode)) {
            int extraFee = orderService.getLatestExtraTimeFee(orderId);
            order.setExtraTimeFee((order.getExtraTimeFee() != null ? order.getExtraTimeFee() : 0) + extraFee);
            order.setTotalFee(order.getTotalFee() + extraFee);
            order.setPhotographerProfit(order.getPhotographerProfit() + extraFee);
            orderService.updateById(order);
            log.info("加時付款成功: orderId={}, extraTradeNo={}, extraFee={}", orderId, extraTradeNo, extraFee);
            notifyService.triggerFlow("extra_time_paid", order.getConsumerId(),
                    "加時付款成功", "訂單 " + order.getOrderNo() + " 加時費用已付款。");
            notifyService.triggerFlow("extra_time_paid", order.getPhotographerId(),
                    "加時付款成功", "訂單 " + order.getOrderNo() + " 加時費用已付款。");
        } else {
            log.warn("加時付款失敗: orderId={}, rtnCode={}", orderId, rtnCode);
        }
        return order;
    }

    private String buildExtraTimeTradeNo(Long orderId) {
        return "EXT" + orderId;
    }

    private String buildCheckoutForm(String merchantTradeNo, int amount, String itemName, String tradeDesc) {
        String tradeDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"));
        Map<String, String> params = new LinkedHashMap<>();
        params.put("MerchantID", merchantId);
        params.put("MerchantTradeNo", merchantTradeNo);
        params.put("MerchantTradeDate", tradeDate);
        params.put("PaymentType", "aio");
        params.put("TotalAmount", String.valueOf(amount));
        params.put("TradeDesc", tradeDesc);
        params.put("ItemName", itemName);
        params.put("ReturnURL", returnUrl);
        String webBase = frontendWebUrl.replaceAll("/$", "");
        params.put("OrderResultURL", webBase + "/thankyou/" + merchantTradeNo);
        params.put("ClientBackURL", webBase + "/orders");
        params.put("ChoosePayment", "ALL");
        String checkMacValue = computeCheckMacValue(new TreeMap<>(params));

        StringBuilder html = new StringBuilder();
        html.append("<form id='ecpayForm' method='POST' action='").append(getCheckoutUrl()).append("'>");
        for (Map.Entry<String, String> e : params.entrySet()) {
            html.append("<input type='hidden' name='").append(e.getKey()).append("' value='")
                    .append(e.getValue()).append("'/>");
        }
        html.append("<input type='hidden' name='CheckMacValue' value='").append(checkMacValue).append("'/>");
        html.append("</form>");
        html.append("<script>document.getElementById('ecpayForm').submit();</script>");
        log.info("產生綠界付款表單: tradeNo={}, amount={}", merchantTradeNo, amount);
        return html.toString();
    }

    private void invokeEcpayRefund(String merchantTradeNo, String tradeNo, int amount) {
        Map<String, String> params = new TreeMap<>();
        params.put("MerchantID", merchantId);
        params.put("MerchantTradeNo", merchantTradeNo);
        params.put("TradeNo", tradeNo);
        params.put("Action", "R");
        params.put("TotalAmount", String.valueOf(amount));
        String checkMacValue = computeCheckMacValue(params);
        params.put("CheckMacValue", checkMacValue);

        String body = params.entrySet().stream()
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .reduce((a, b) -> a + "&" + b)
                .orElse("");

        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(getDoActionUrl()))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            log.info("綠界退款回應: orderNo={}, body={}", merchantTradeNo, response.body());
            if (!response.body().contains("RtnCode=1") && !response.body().contains("\"RtnCode\":\"1\"")) {
                throw new ServiceException(ResultCode.PAYMENT_FAILED, "綠界退款失敗: " + response.body());
            }
        } catch (Exception e) {
            log.error("綠界退款 API 呼叫失敗: orderNo={}", merchantTradeNo, e);
            throw new ServiceException(ResultCode.PAYMENT_CALLBACK_INVALID, "退款 API 呼叫失敗");
        }
    }

    private String getCheckoutUrl() {
        return "Production".equalsIgnoreCase(ecpayMode)
                ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
                : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
    }

    private String getDoActionUrl() {
        return "Production".equalsIgnoreCase(ecpayMode)
                ? "https://payment.ecpay.com.tw/CreditDetail/DoAction"
                : "https://payment-stage.ecpay.com.tw/CreditDetail/DoAction";
    }

    @Override
    @Transactional
    public Order simulateStagingPaymentSuccess(Long orderId) {
        if (!stagingPaymentSimulateEnabled || !"Test".equalsIgnoreCase(ecpayMode)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "staging 模擬付款未啟用");
        }
        if (merchantId == null || merchantId.isEmpty()
                || hashKey == null || hashKey.isEmpty()
                || hashIv == null || hashIv.isEmpty()) {
            throw new ServiceException(ResultCode.PAYMENT_FAILED, "未設定綠界測試商戶金鑰");
        }

        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        if (OrderStatus.DRAFT.getCode().equals(order.getStatus())) {
            order = orderService.transition(orderId, OrderStatus.PENDING_PAYMENT,
                    "STAGING_CHECKOUT", "Staging 進入待付款", "STAGING");
        }

        if (OrderStatus.WAITING_PROVIDER_CONTACT.getCode().equals(order.getStatus())
                || OrderStatus.PAID.getCode().equals(order.getStatus())) {
            return order;
        }

        if (!OrderStatus.PENDING_PAYMENT.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID,
                    "訂單狀態須為 Draft 或 PendingPayment，目前為 " + order.getStatus());
        }

        Map<String, String> params = new TreeMap<>();
        params.put("MerchantTradeNo", order.getOrderNo());
        params.put("RtnCode", "1");
        params.put("TradeNo", "STAGING" + orderId);
        params.put("PaymentType", "Credit_CreditCard");
        String mac = computeCheckMacValue(params);
        params.put("CheckMacValue", mac);

        log.info("Staging 模擬付款成功: orderNo={}", order.getOrderNo());
        return handlePaymentCallback(params);
    }
}