package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.PageResult;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.OrderHistory;
import com.wanderlens.api.entity.ShootEvent;
import com.wanderlens.api.entity.dto.CreateOrderRequest;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.entity.enums.ShootEventType;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.OrderHistoryMapper;
import com.wanderlens.api.mapper.OrderMapper;
import com.wanderlens.api.mapper.ShootEventMapper;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    private final OrderHistoryMapper orderHistoryMapper;
    private final ShootEventMapper shootEventMapper;
    private final AvailabilityService availabilityService;
    private final com.wanderlens.api.mapper.StudioAvailabilityMapper studioAvailabilityMapper;
    private final com.wanderlens.api.mapper.ProviderMapper providerMapper;
    private final com.wanderlens.api.service.ConversationService conversationService;

    @org.springframework.beans.factory.annotation.Value("${wanderlens.pricing.default-unit-price:800}")
    private int defaultUnitPrice;

    @org.springframework.beans.factory.annotation.Value("${wanderlens.pricing.platform-commission-rate:0.20}")
    private double platformCommissionRate;

    @Override
    @Transactional
    public Order createOrder(CreateOrderRequest request, Long consumerId) {
        // ── 驗證攝影師存在性與上架狀態 ──
        com.wanderlens.api.entity.Provider photographer = providerMapper.selectById(request.getPhotographerId());
        if (photographer == null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "攝影師不存在");
        }
        if (!"PHOTOGRAPHER".equals(photographer.getProviderType())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "指定的供給方不是攝影師");
        }
        if (!"Y".equals(photographer.getGoLive())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "攝影師目前未上架");
        }

        if (request.getSecondPhotographerId() != null) {
            com.wanderlens.api.entity.Provider second = providerMapper.selectById(request.getSecondPhotographerId());
            if (second == null || !"PHOTOGRAPHER".equals(second.getProviderType()) || !"Y".equals(second.getGoLive())) {
                throw new ServiceException(ResultCode.BAD_REQUEST, "第二位攝影師不可用");
            }
            if (request.getSecondPhotographerId().equals(request.getPhotographerId())) {
                throw new ServiceException(ResultCode.BAD_REQUEST, "雙機不可選同一位攝影師");
            }
        }

        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setConsumerId(consumerId);
        order.setPhotographerId(request.getPhotographerId());
        order.setSecondPhotographerId(request.getSecondPhotographerId());
        order.setStylistId(request.getStylistId());
        order.setStudioId(request.getStudioId());
        order.setServiceTypeId(request.getServiceTypeId());
        order.setConfigurationId(request.getConfigurationId());
        order.setShootingDate(request.getShootingDate());
        order.setShootingTime(request.getShootingTime());
        order.setShootingDuration(request.getShootingDuration());
        order.setShootingLocation(request.getShootingLocation());
        order.setAdultNum(request.getAdultNum());
        order.setChildNum(request.getChildNum());
        order.setCustomerName(request.getCustomerName());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setEmail(request.getEmail());
        order.setCouponCode(request.getCouponCode());
        order.setStatus(OrderStatus.DRAFT.getCode());
        order.setManualOrder("N");

        // ── 前置驗證 ──
        // 1. 拍攝日期不可為過去
        if (request.getShootingDate() != null && request.getShootingDate().isBefore(java.time.LocalDate.now())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "拍攝日期不可為過去");
        }
        // 2. 不可向自己下單
        if (request.getPhotographerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "不可向自己下單");
        }
        // 3. 拍攝時數必須 > 0
        if (request.getShootingDuration() == null || request.getShootingDuration().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "拍攝時數必須大於 0");
        }

        // ── 計算費用 ──
        // 從 Spring 配置取得預設單價
        int unitPrice = defaultUnitPrice;
        int hours = request.getShootingDuration().intValue();
        // 支援小數時長：用 BigDecimal 精確計算
        java.math.BigDecimal serviceFeeBD = request.getShootingDuration()
                .multiply(java.math.BigDecimal.valueOf(unitPrice))
                .setScale(0, java.math.RoundingMode.HALF_UP);
        int serviceFee = serviceFeeBD.intValue();
        // 交通費：目前為 0（需 Google Maps API 整合後計算）
        int transportationFee = 0;

        // 平台抽成率（從配置取得）
        int photographerProfit = new java.math.BigDecimal(serviceFee)
                .multiply(java.math.BigDecimal.valueOf(1 - platformCommissionRate))
                .setScale(0, java.math.RoundingMode.HALF_UP)
                .intValue();

        order.setUnitPrice(unitPrice);
        order.setServiceFee(serviceFee);
        order.setTransportationFee(transportationFee);
        order.setExtraTimeFee(0);
        order.setCouponDiscount(0);
        order.setTotalFee(serviceFee + transportationFee);
        order.setPhotographerProfit(photographerProfit);

        // ── 產生不重複訂單編號 ──
        order.setOrderNo(generateOrderNo());

        save(order);

        // 鎖定時段
        if (request.getAvailabilityId() != null) {
            availabilityService.lockSlot(request.getAvailabilityId(), order.getId());
        }
        if (request.getSecondAvailabilityId() != null) {
            availabilityService.lockSlot(request.getSecondAvailabilityId(), order.getId());
        }
        if (request.getStudioId() != null) {
            lockStudioSlot(request.getStudioId(), request.getShootingDate(), request.getShootingTime(), order.getId());
        }

        log.info("建立訂單: orderNo={}, consumerId={}, photographerId={}",
                order.getOrderNo(), consumerId, request.getPhotographerId());
        return order;
    }

    @Override
    @Transactional
    public Order transition(Long orderId, OrderStatus toStatus, String action, String detail, String execBy) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        OrderStatus current = OrderStatus.fromCode(order.getStatus());

        // 驗證狀態轉移合法性
        if (!OrderStatus.canTransition(current, toStatus)) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID,
                    String.format("不可從 %s 轉移至 %s", current.getLabel(), toStatus.getLabel()));
        }

        // 記錄歷程
        OrderHistory history = new OrderHistory();
        history.setOrderId(orderId);
        history.setOrderNo(order.getOrderNo());
        history.setFromStatus(current.getCode());
        history.setToStatus(toStatus.getCode());
        history.setAction(action);
        history.setActionDetail(detail);
        history.setExecBy(execBy);
        orderHistoryMapper.insert(history);

        // 更新狀態
        order.setStatus(toStatus.getCode());
        updateById(order);

        if (toStatus == OrderStatus.CLOSED) {
            conversationService.setReadonlyForOrder(orderId);
        } else if (toStatus == OrderStatus.DISPUTED) {
            conversationService.reopenForOrder(orderId);
        }

        log.info("訂單狀態轉移: orderNo={}, {} → {}, action={}",
                order.getOrderNo(), current.getCode(), toStatus.getCode(), action);
        return order;
    }

    @Override
    @Transactional
    public Order contactCustomer(Long orderId, Long providerId) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if (!order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }
        return transition(orderId, OrderStatus.CONFIRMED, "CONTACT_CUSTOMER",
                "攝影師已聯繫客戶", String.valueOf(providerId));
    }

    @Override
    @Transactional
    public Order confirmReadyToShoot(Long orderId, Long providerId) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if (!order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }
        return transition(orderId, OrderStatus.READY_TO_SHOOT, "CONFIRM_READY",
                "攝影師確認待拍攝", String.valueOf(providerId));
    }

    @Override
    @Transactional
    public ShootEvent startShoot(Long orderId, Long providerId) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if (!order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }

        // 狀態轉移：ReadyToShoot → ShootingStarted
        transition(orderId, OrderStatus.SHOOTING_STARTED, "SHOOT_START",
                "攝影師按下開始", String.valueOf(providerId));

        // 記錄事件
        ShootEvent event = new ShootEvent();
        event.setOrderId(orderId);
        event.setEventType(ShootEventType.SHOOT_START.getCode());
        event.setEventTime(LocalDateTime.now());
        event.setOperatorId(providerId);
        shootEventMapper.insert(event);

        log.info("起拍: orderNo={}, time={}", order.getOrderNo(), event.getEventTime());
        return event;
    }

    @Override
    @Transactional
    public ShootEvent endShoot(Long orderId, Long providerId) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        // 驗證攝影師身份
        if (order.getPhotographerId() == null || !order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }

        // 狀態轉移：ShootingStarted → ShootingEnded
        transition(orderId, OrderStatus.SHOOTING_ENDED, "SHOOT_END",
                "攝影師按下結束", String.valueOf(providerId));

        ShootEvent event = new ShootEvent();
        event.setOrderId(orderId);
        event.setEventType(ShootEventType.SHOOT_END.getCode());
        event.setEventTime(LocalDateTime.now());
        event.setOperatorId(providerId);
        shootEventMapper.insert(event);

        log.info("結束拍攝: orderNo={}, time={}", order.getOrderNo(), event.getEventTime());
        return event;
    }

    @Override
    @Transactional
    public ShootEvent requestExtraTime(Long orderId, Long providerId, int minutes, int fee) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        // 驗證攝影師身份
        if (order.getPhotographerId() == null || !order.getPhotographerId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的攝影師");
        }
        // 驗證訂單狀態為拍攝中
        if (!OrderStatus.SHOOTING_STARTED.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID, "只有在拍攝中才能申請加時");
        }
        // 驗證參數合理性
        if (minutes <= 0 || minutes > 120) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "加時分鐘需在 1-120 之間");
        }
        if (fee < 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "加時費用不可為負");
        }

        ShootEvent event = new ShootEvent();
        event.setOrderId(orderId);
        event.setEventType(ShootEventType.EXTRA_TIME_REQUEST.getCode());
        event.setEventTime(LocalDateTime.now());
        event.setExtraTimeMinutes(minutes);
        event.setExtraTimeFee(fee);
        event.setOperatorId(providerId);
        shootEventMapper.insert(event);

        log.info("加時申請: orderNo={}, minutes={}, fee={}", order.getOrderNo(), minutes, fee);
        return event;
    }

    @Override
    @Transactional
    public Order confirmExtraTime(Long orderId, Long consumerId) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        // 驗證消費者身份
        if (!order.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的消費者");
        }

        // 找最新的加時申請
        ShootEvent extraRequest = shootEventMapper.selectOne(
                new LambdaQueryWrapper<ShootEvent>()
                        .eq(ShootEvent::getOrderId, orderId)
                        .eq(ShootEvent::getEventType, ShootEventType.EXTRA_TIME_REQUEST.getCode())
                        .orderByDesc(ShootEvent::getEventTime)
                        .last("LIMIT 1"));

        if (extraRequest == null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "無加時申請");
        }

        // 記錄確認事件（費用於加時付款成功回呼後才入帳）
        ShootEvent confirmEvent = new ShootEvent();
        confirmEvent.setOrderId(orderId);
        confirmEvent.setEventType(ShootEventType.EXTRA_TIME_CONFIRMED.getCode());
        confirmEvent.setEventTime(LocalDateTime.now());
        confirmEvent.setExtraTimeMinutes(extraRequest.getExtraTimeMinutes());
        confirmEvent.setExtraTimeFee(extraRequest.getExtraTimeFee());
        confirmEvent.setOperatorId(consumerId);
        shootEventMapper.insert(confirmEvent);

        log.info("加時確認（待付款）: orderNo={}, extraFee={}", order.getOrderNo(), extraRequest.getExtraTimeFee());
        return order;
    }

    @Override
    public int getLatestExtraTimeFee(Long orderId) {
        ShootEvent extraRequest = shootEventMapper.selectOne(
                new LambdaQueryWrapper<ShootEvent>()
                        .eq(ShootEvent::getOrderId, orderId)
                        .eq(ShootEvent::getEventType, ShootEventType.EXTRA_TIME_REQUEST.getCode())
                        .orderByDesc(ShootEvent::getEventTime)
                        .last("LIMIT 1"));
        return extraRequest != null && extraRequest.getExtraTimeFee() != null
                ? extraRequest.getExtraTimeFee() : 0;
    }

    @Override
    @Transactional
    public Order cancelOrder(Long orderId, String reason, String execBy) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        OrderStatus current = OrderStatus.fromCode(order.getStatus());

        // ── 分級退款邏輯 ──
        String detail = reason;
        if (current == OrderStatus.PAID || current == OrderStatus.WAITING_PROVIDER_CONTACT
                || current == OrderStatus.CONFIRMED || current == OrderStatus.READY_TO_SHOOT) {
            int refundPercent = calculateRefundPercent(order);
            detail = reason + String.format("（退款比例: %d%%）", refundPercent);
        }

        Order result = transition(orderId, OrderStatus.CANCELLED, "CANCEL", detail, execBy);

        // ── 釋放鎖定的時段 ──
        availabilityService.unlockSlotByOrderId(orderId);

        log.info("訂單取消: orderNo={}, reason={}, refundPercent={}",
                order.getOrderNo(), reason,
                (current == OrderStatus.PAID || current == OrderStatus.WAITING_PROVIDER_CONTACT) ? calculateRefundPercent(order) + "%" : "N/A");
        return result;
    }

    /**
     * 依拍攝日距離計算退款比例
     * - 7 天前：100% 退款
     * - 3-7 天：50% 退款
     * - 3 天內：不退款
     */
    private int calculateRefundPercent(Order order) {
        if (order.getShootingDate() == null) return 100;
        long daysUntilShoot = java.time.temporal.ChronoUnit.DAYS.between(
                java.time.LocalDate.now(), order.getShootingDate());
        if (daysUntilShoot >= 7) return 100;
        if (daysUntilShoot >= 3) return 50;
        return 0;
    }

    @Override
    @Transactional
    public Order rematch(Long orderId, String reason) {
        Order order = getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        // 轉移到重新媒合
        transition(orderId, OrderStatus.REMATCHING, "REMATCH", reason, "SYSTEM");

        // ── 釋放原攝影師的時段 ──
        availabilityService.unlockSlotByOrderId(orderId);

        // ── 記錄原攝影師違規 ──
        if (order.getPhotographerId() != null) {
            recordViolation(order.getPhotographerId(), orderId, reason);
        }

        // ── 搜尋替代攝影師 ──
        // 觸發非同步搜尋：目前先記錄，由營運手動處理
        // 後續可整合 SearchService 自動搜尋並通知
        log.info("重新媒合: orderNo={}, reason={}, 原攝影師={}. 營運需手動指派新攝影師。",
                order.getOrderNo(), reason, order.getPhotographerId());
        return order;
    }

    /**
     * 記錄攝影師違規（分級懲罰）
     * 第一次：WARNING，第二次：SUSPENDED（暫停一週），第三次：PERMANENT_BAN
     */
    private void recordViolation(Long photographerId, Long orderId, String reason) {
        // 查詢攝影師目前違規次數
        com.wanderlens.api.entity.Provider provider = providerMapper.selectById(photographerId);
        if (provider == null) {
            log.warn("攝影師不存在: photographerId={}", photographerId);
            return;
        }

        // 遞增違規次數（使用 violationCount 欄位，若不存在則用 log 記錄）
        int currentViolations = provider.getViolationCount() != null ? provider.getViolationCount() : 0;
        int newViolationCount = currentViolations + 1;

        // 依違規次數分級處理
        String violationLevel;
        if (newViolationCount == 1) {
            violationLevel = "WARNING";
        } else if (newViolationCount == 2) {
            violationLevel = "SUSPENDED";
            provider.setGoLive("N");
            provider.setSuspendedUntil(java.time.LocalDateTime.now().plusDays(7));
        } else {
            violationLevel = "PERMANENT_BAN";
            // 永久停權
            provider.setGoLive("N");
        }

        // 更新攝影師違規資料
        provider.setViolationCount(newViolationCount);
        provider.setViolationLevel(violationLevel);
        providerMapper.updateById(provider);

        log.warn("攝影師違規記錄: photographerId={}, orderId={}, reason={}, violationCount={}, level={}",
                photographerId, orderId, reason, newViolationCount, violationLevel);
    }

    @Override
    public List<OrderHistory> getOrderHistory(Long orderId) {
        return orderHistoryMapper.selectList(
                new LambdaQueryWrapper<OrderHistory>()
                        .eq(OrderHistory::getOrderId, orderId)
                        .orderByAsc(OrderHistory::getCreatedAt));
    }

    @Override
    public List<ShootEvent> getShootEvents(Long orderId) {
        return shootEventMapper.selectList(
                new LambdaQueryWrapper<ShootEvent>()
                        .eq(ShootEvent::getOrderId, orderId)
                        .orderByAsc(ShootEvent::getEventTime));
    }

    @Override
    public List<Order> getProviderOrders(Long providerId) {
        return list(new LambdaQueryWrapper<Order>()
                .eq(Order::getPhotographerId, providerId)
                .notIn(Order::getStatus,
                        OrderStatus.CANCELLED.getCode(),
                        OrderStatus.REFUNDED.getCode())
                .orderByDesc(Order::getShootingDate));
    }

    @Override
    public List<Order> getConsumerOrders(Long consumerId) {
        return list(new LambdaQueryWrapper<Order>()
                .eq(Order::getConsumerId, consumerId)
                .orderByDesc(Order::getCreatedAt));
    }

    @Override
    public com.wanderlens.api.common.PageResult<Order> getConsumerOrdersPaged(Long consumerId, int page, int size) {
        Page<Order> p = page(new Page<>(page, size), new LambdaQueryWrapper<Order>()
                .eq(Order::getConsumerId, consumerId)
                .orderByDesc(Order::getCreatedAt));
        return new com.wanderlens.api.common.PageResult<>(p.getRecords(), p.getTotal(), page, size);
    }

    @Override
    public com.wanderlens.api.common.PageResult<Order> getOrdersByStatusPaged(OrderStatus status, int page, int size) {
        Page<Order> p = page(new Page<>(page, size), new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, status.getCode())
                .orderByDesc(Order::getCreatedAt));
        return new com.wanderlens.api.common.PageResult<>(p.getRecords(), p.getTotal(), page, size);
    }

    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, status.getCode())
                .orderByDesc(Order::getCreatedAt));
    }

    @Override
    public String generateOrderNo() {
        // 時間戳 + 4 碼隨機，避免並發撞號
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSS"));
        String random = String.format("%04d", new java.util.Random().nextInt(10000));
        return timestamp + random;
    }

    private void lockStudioSlot(Long studioId, LocalDate date, String shootingTime, Long orderId) {
        if (date == null || shootingTime == null || !shootingTime.contains("-")) return;
        String[] parts = shootingTime.split("-");
        java.time.LocalTime start = java.time.LocalTime.parse(parts[0].trim());
        java.time.LocalTime end = java.time.LocalTime.parse(parts[1].trim());
        List<com.wanderlens.api.entity.StudioAvailability> slots = studioAvailabilityMapper.selectList(
                new LambdaQueryWrapper<com.wanderlens.api.entity.StudioAvailability>()
                        .eq(com.wanderlens.api.entity.StudioAvailability::getStudioId, studioId)
                        .eq(com.wanderlens.api.entity.StudioAvailability::getScheduleDate, date)
                        .eq(com.wanderlens.api.entity.StudioAvailability::getActive, "Y")
                        .isNull(com.wanderlens.api.entity.StudioAvailability::getLockedByOrderId));
        for (com.wanderlens.api.entity.StudioAvailability slot : slots) {
            if (!start.isBefore(slot.getSlotStart()) && !end.isAfter(slot.getSlotEnd())) {
                slot.setLockedByOrderId(orderId);
                studioAvailabilityMapper.updateById(slot);
                return;
            }
        }
    }
}