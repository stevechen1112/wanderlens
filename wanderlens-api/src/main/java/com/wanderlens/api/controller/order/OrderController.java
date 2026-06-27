package com.wanderlens.api.controller.order;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wanderlens.api.common.PageResult;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.OrderHistory;
import com.wanderlens.api.entity.ShootEvent;
import com.wanderlens.api.entity.dto.CreateOrderRequest;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.PaymentService;
import com.wanderlens.api.util.AuthUtil;
import com.wanderlens.api.util.ProviderIdResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 訂單 API
 */
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Order", description = "訂單與狀態機")
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final AuthUtil authUtil;
    private final ProviderIdResolver providerIdResolver;

    // ── 建立 / 查詢 ──

    @PostMapping
    @Operation(summary = "建立訂單")
    public Result<Order> createOrder(HttpServletRequest request,
                                     @Valid @RequestBody CreateOrderRequest body) {
        Long consumerId = (Long) request.getAttribute("userId");
        return Result.ok(orderService.createOrder(body, consumerId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "訂單詳情")
    public Result<Order> getOrder(HttpServletRequest request, @PathVariable Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        return Result.ok(order);
    }

    @GetMapping("/my")
    @Operation(summary = "我的訂單（消費者，支援分頁）")
    public Result<?> myOrders(HttpServletRequest request,
                              @RequestParam(required = false) Integer page,
                              @RequestParam(required = false, defaultValue = "10") int size) {
        Long consumerId = (Long) request.getAttribute("userId");
        if (page != null && page > 0) {
            return Result.ok(orderService.getConsumerOrdersPaged(consumerId, page, size));
        }
        return Result.ok(orderService.getConsumerOrders(consumerId));
    }

    @GetMapping("/by-trade-no/{tradeNo}")
    @Operation(summary = "依綠界 MerchantTradeNo / 加時 EXT 編號查詢訂單")
    public Result<Order> getByTradeNo(HttpServletRequest request, @PathVariable String tradeNo) {
        Order order;
        if (tradeNo != null && tradeNo.startsWith("EXT")) {
            try {
                order = orderService.getById(Long.parseLong(tradeNo.substring(3)));
            } catch (NumberFormatException e) {
                return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
            }
        } else {
            order = paymentService.getOrderByNo(tradeNo);
        }
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        return Result.ok(order);
    }

    @GetMapping("/provider")
    @Operation(summary = "攝影師訂單")
    public Result<List<Order>> providerOrders(HttpServletRequest request) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.getProviderOrders(providerId));
    }

    @GetMapping("/all")
    @Operation(summary = "所有訂單分頁（後台）")
    public Result<?> allOrders(HttpServletRequest request,
                               @RequestParam(required = false) String status,
                               @RequestParam(defaultValue = "1") int page,
                               @RequestParam(defaultValue = "20") int size) {
        authUtil.requireAdmin(request);
        if (status != null) {
            return Result.ok(orderService.getOrdersByStatusPaged(OrderStatus.fromCode(status), page, size));
        }
        Page<Order> p = orderService.page(new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page, size),
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Order>()
                        .orderByDesc(Order::getCreatedAt));
        return Result.ok(new PageResult<>(p.getRecords(), p.getTotal(), page, size));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "訂單歷程")
    public Result<List<OrderHistory>> orderHistory(HttpServletRequest request, @PathVariable Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        return Result.ok(orderService.getOrderHistory(id));
    }

    @GetMapping("/{id}/shoot-events")
    @Operation(summary = "拍攝事件")
    public Result<List<ShootEvent>> shootEvents(HttpServletRequest request, @PathVariable Long id) {
        Order order = orderService.getById(id);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        return Result.ok(orderService.getShootEvents(id));
    }

    // ── 履約操作 ──

    @PostMapping("/contact/{orderId}")
    @Operation(summary = "攝影師回報已聯繫")
    public Result<Order> contactCustomer(HttpServletRequest request,
                                         @PathVariable Long orderId) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.contactCustomer(orderId, providerId));
    }

    @PostMapping("/confirm-ready/{orderId}")
    @Operation(summary = "攝影師確認待拍攝")
    public Result<Order> confirmReadyToShoot(HttpServletRequest request,
                                             @PathVariable Long orderId) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.confirmReadyToShoot(orderId, providerId));
    }

    @PostMapping("/shoot/start")
    @Operation(summary = "起拍（時間戳記）")
    public Result<ShootEvent> startShoot(HttpServletRequest request,
                                         @RequestParam Long orderId) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.startShoot(orderId, providerId));
    }

    @PostMapping("/shoot/end")
    @Operation(summary = "結束拍攝（時間戳記）")
    public Result<ShootEvent> endShoot(HttpServletRequest request,
                                       @RequestParam Long orderId) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.endShoot(orderId, providerId));
    }

    @PostMapping("/shoot/extra-time")
    @Operation(summary = "加時申請")
    public Result<ShootEvent> requestExtraTime(HttpServletRequest request,
                                                @RequestParam Long orderId,
                                                @RequestParam int minutes,
                                                @RequestParam int fee) {
        Long providerId = providerIdResolver.resolve(request);
        return Result.ok(orderService.requestExtraTime(orderId, providerId, minutes, fee));
    }

    @PostMapping("/shoot/extra-time/confirm")
    @Operation(summary = "消費者確認加時（回傳付款表單）")
    public Result<Map<String, Object>> confirmExtraTime(HttpServletRequest request,
                                          @RequestParam Long orderId) {
        Long consumerId = (Long) request.getAttribute("userId");
        Order order = orderService.confirmExtraTime(orderId, consumerId);
        int extraFee = orderService.getLatestExtraTimeFee(orderId);
        String paymentForm = paymentService.generateExtraTimePayment(orderId, extraFee);
        return Result.ok(Map.of("order", order, "paymentForm", paymentForm, "extraFee", extraFee));
    }

    // ── 例外操作 ──

    @PostMapping("/cancel")
    @Operation(summary = "取消訂單")
    public Result<Order> cancelOrder(HttpServletRequest request,
                                     @RequestParam Long orderId,
                                     @RequestParam String reason) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        authUtil.requireOrderAccess(request, order);
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(orderService.cancelOrder(orderId, reason, String.valueOf(userId)));
    }

    @PostMapping("/rematch/{orderId}")
    @Operation(summary = "重新媒合（後台）")
    public Result<Order> rematch(HttpServletRequest request,
                                 @PathVariable Long orderId,
                                 @RequestParam String reason) {
        authUtil.requireAdmin(request);
        return Result.ok(orderService.rematch(orderId, reason));
    }
}