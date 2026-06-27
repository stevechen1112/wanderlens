package com.wanderlens.api.controller.payment;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.LedgerEntry;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.service.LedgerService;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.PaymentService;
import com.wanderlens.api.util.ProviderIdResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 金流 API
 */
@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "金流")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final LedgerService ledgerService;
    private final ProviderIdResolver providerIdResolver;

    @GetMapping("/ecpay/checkout/{orderId}")
    @Operation(summary = "取得綠界付款表單", description = "回傳 HTML form，前端直接渲染跳轉")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> ecpayCheckout(HttpServletRequest httpRequest, @PathVariable Long orderId) {
        // 驗證訂單所有權（IDOR 防護）
        Long userId = (Long) httpRequest.getAttribute("userId");
        Order order = paymentService.getOrderById(orderId);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        if (!userId.equals(order.getConsumerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限對此訂單付款");
        }
        return Result.ok(paymentService.generateEcpayCheckout(orderId));
    }

    @PostMapping("/staging/simulate-success/{orderId}")
    @Operation(summary = "Staging 模擬付款成功", description = "僅 ECPAY_MODE=Test；訂單須為消費者本人或管理員")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Order> simulateStagingPayment(HttpServletRequest httpRequest, @PathVariable Long orderId) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");
        Order order = paymentService.getOrderById(orderId);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        boolean isAdmin = "ADMIN".equals(role) || "SUPPORT".equals(role);
        if (!isAdmin && !userId.equals(order.getConsumerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限模擬此訂單付款");
        }
        return Result.ok(paymentService.simulateStagingPaymentSuccess(orderId));
    }

    @GetMapping(value = "/ecpay/extra-time/{orderId}", produces = "text/html;charset=UTF-8")
    @Operation(summary = "加時付款表單（HTML）")
    @SecurityRequirement(name = "Bearer Authentication")
    public String ecpayExtraTimeHtml(HttpServletRequest httpRequest, @PathVariable Long orderId) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        Order order = paymentService.getOrderById(orderId);
        if (order == null || !userId.equals(order.getConsumerId())) {
            return "<html><body>無權限</body></html>";
        }
        int extraFee = orderService.getLatestExtraTimeFee(orderId);
        if (extraFee <= 0) {
            return "<html><body>無待付加時費用</body></html>";
        }
        return paymentService.generateExtraTimePayment(orderId, extraFee);
    }

    @PostMapping("/ecpay/callback")
    @Operation(summary = "綠界付款回呼", description = "綠界 Server-side 回呼，不需認證")
    public String ecpayCallback(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        Enumeration<String> names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            params.put(name, request.getParameter(name));
        }

        log.info("綠界付款回呼: params={}", params);
        Order order = paymentService.handlePaymentCallback(params);
        return "1|OK"; // 綠界要求回傳 "1|OK" 表示收到
    }

    @GetMapping("/check/{orderNo}")
    @Operation(summary = "檢查付款狀態")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> checkPayment(HttpServletRequest httpRequest, @PathVariable String orderNo) {
        // 驗證訂單所有權（IDOR 防護）
        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");
        Order order = paymentService.getOrderByNo(orderNo);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        boolean isPhotographer = order.getPhotographerId() != null
                && order.getPhotographerId().equals(providerIdResolver.resolve(userId));
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)
                && !userId.equals(order.getConsumerId())
                && !isPhotographer) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看此訂單付款狀態");
        }
        return Result.ok(paymentService.checkPaymentStatus(orderNo));
    }

    @PostMapping("/refund")
    @Operation(summary = "退款（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Order> refund(HttpServletRequest request,
                                @RequestParam Long orderId,
                                @RequestParam String reason) {
        // 驗證管理員權限
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"FINANCE".equals(role) && !"SUPPORT".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限執行退款");
        }
        return Result.ok(paymentService.refund(orderId, reason));
    }

    @PostMapping("/payout/{orderId}")
    @Operation(summary = "撥款（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> payout(HttpServletRequest request,
                               @PathVariable Long orderId,
                               @RequestParam Long providerId) {
        // 驗證管理員權限
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"FINANCE".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限執行撥款");
        }
        ledgerService.payout(orderId, providerId);
        return Result.ok();
    }

    @GetMapping("/ledger/entries/{orderId}")
    @Operation(summary = "清算記錄（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<LedgerEntry>> ledgerEntries(HttpServletRequest request,
                                                    @PathVariable Long orderId) {
        // 驗證管理員權限
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"FINANCE".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看清算記錄");
        }
        return Result.ok(ledgerService.getEntriesByOrderId(orderId));
    }
}