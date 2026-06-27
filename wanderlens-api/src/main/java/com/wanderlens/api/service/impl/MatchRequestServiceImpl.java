package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.entity.dto.*;
import com.wanderlens.api.entity.enums.MatchRequestStatus;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.AvailabilityMapper;
import com.wanderlens.api.mapper.ConfigurationMapper;
import com.wanderlens.api.mapper.MatchRequestMapper;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.service.*;
import com.wanderlens.api.util.GeoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchRequestServiceImpl implements MatchRequestService {

    private static final String MATCH_REQUEST_PREFIX = "match:request:";
    private static final String MATCH_ACCEPT_PREFIX = "match:accept:";
    private static final int RESPONSE_SECONDS = 15;

    private final MatchRequestMapper matchRequestMapper;
    private final ProviderMapper providerMapper;
    private final ConfigurationMapper configurationMapper;
    private final AvailabilityMapper availabilityMapper;
    private final PhotographerOnlineServiceImpl onlineService;
    private final MatchBroadcastEngine broadcastEngine;
    private final MatchWebSocketRegistry webSocketRegistry;
    private final MatchingEventHub matchingEventHub;
    private final OrderService orderService;
    private final AvailabilityService availabilityService;
    private final NotifyService notifyService;
    private final SearchService searchService;
    private final MatchFeatureService matchFeatureService;
    private final MatchAnalyticsService matchAnalyticsService;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${wanderlens.pricing.default-unit-price:800}")
    private int defaultUnitPrice;

    @Override
    @Transactional
    public MatchRequestDto createRequest(Long consumerId, CreateInstantMatchRequest req) {
        matchFeatureService.assertInstantMatchEnabled();
        matchFeatureService.assertServiceTypeAllowed(req.getServiceTypeId());
        if (req.getDurationHours() == null || req.getDurationHours().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "拍攝時長必須大於 0");
        }

        Long configurationId = resolveConfigurationId(req.getServiceTypeId());
        int offset = req.getStartOffsetMinutes() != null ? req.getStartOffsetMinutes() : 0;
        LocalDateTime scheduledTime = LocalDateTime.now().plusMinutes(offset);
        int fee = req.getDurationHours().multiply(BigDecimal.valueOf(defaultUnitPrice))
                .setScale(0, RoundingMode.HALF_UP).intValue();

        MatchRequest entity = new MatchRequest();
        entity.setConsumerId(consumerId);
        entity.setServiceTypeId(req.getServiceTypeId());
        entity.setConfigurationId(configurationId);
        entity.setStatus(MatchRequestStatus.SEARCHING.getCode());
        entity.setCity(req.getCity() != null ? req.getCity() : "default");
        entity.setShootingLocation(req.getShootingLocation());
        entity.setShootingLat(req.getShootingLat());
        entity.setShootingLng(req.getShootingLng());
        entity.setDurationHours(req.getDurationHours());
        entity.setScheduledTime(scheduledTime);
        entity.setEstimatedFee(fee);
        entity.setRadiusKm(10);
        entity.setBroadcastRound(1);
        entity.setCustomerName(req.getCustomerName());
        entity.setCustomerPhone(req.getCustomerPhone());
        entity.setExpiresAt(LocalDateTime.now().plusSeconds(60));
        matchRequestMapper.insert(entity);

        cacheRequest(entity);
        broadcastToProviders(entity);
        matchAnalyticsService.track("REQUEST_CREATED", entity.getId(), consumerId, null,
                entity.getCity(), entity.getServiceTypeId(), null);

        return toDto(entity);
    }

    @Override
    public MatchRequestDto getRequest(Long consumerId, Long requestId) {
        MatchRequest entity = requireRequest(requestId);
        if (!entity.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限查看此需求");
        }
        return toDto(entity);
    }

    @Override
    @Transactional
    public void cancelRequest(Long consumerId, Long requestId) {
        MatchRequest entity = requireRequest(requestId);
        if (!entity.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限取消此需求");
        }
        if (MatchRequestStatus.CANCELLED.getCode().equals(entity.getStatus())
                || MatchRequestStatus.EXPIRED.getCode().equals(entity.getStatus())) {
            return;
        }
        entity.setStatus(MatchRequestStatus.CANCELLED.getCode());
        matchRequestMapper.updateById(entity);
        broadcastEngine.publish(MatchBroadcastPayload.builder().type("MATCH_CLOSED").requestId(requestId).build());
        matchingEventHub.publish(requestId, "CANCELLED", toDto(entity));
    }

    @Override
    @Transactional
    public MatchRequestDto acceptRequest(Long providerId, Long requestId) {
        Boolean won = stringRedisTemplate.opsForValue()
                .setIfAbsent(MATCH_ACCEPT_PREFIX + requestId, providerId.toString(), Duration.ofSeconds(30));
        if (Boolean.FALSE.equals(won)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "ALREADY_TAKEN");
        }
        // 接單流程若回滾（檔期衝突、建單失敗等），釋放接單鎖讓其他攝影師可立即重試
        releaseAcceptLockOnRollback(requestId);

        MatchRequest entity = requireRequest(requestId);
        if (!MatchRequestStatus.SEARCHING.getCode().equals(entity.getStatus())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "需求已結束");
        }

        Provider provider = providerMapper.selectById(providerId);
        if (provider == null || !"Y".equals(provider.getGoLive())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "攝影師不可接單");
        }

        LocalDate shootDate = entity.getScheduledTime().toLocalDate();
        LocalTime start = entity.getScheduledTime().toLocalTime().withSecond(0).withNano(0);
        LocalTime end = start.plusMinutes(entity.getDurationHours().multiply(BigDecimal.valueOf(60)).longValue());
        if (!availabilityService.isAvailable(providerId, shootDate, start.toString(), end.toString())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "時段不可用");
        }

        Long availabilityId = findAvailabilityId(providerId, shootDate, start, end);

        CreateOrderRequest orderReq = new CreateOrderRequest();
        orderReq.setPhotographerId(providerId);
        orderReq.setServiceTypeId(entity.getServiceTypeId());
        orderReq.setConfigurationId(entity.getConfigurationId());
        orderReq.setShootingDate(shootDate);
        orderReq.setShootingTime(start.format(DateTimeFormatter.ofPattern("HH:mm")));
        orderReq.setShootingDuration(entity.getDurationHours());
        orderReq.setShootingLocation(entity.getShootingLocation());
        orderReq.setShootingLat(entity.getShootingLat());
        orderReq.setShootingLng(entity.getShootingLng());
        orderReq.setCustomerName(entity.getCustomerName() != null ? entity.getCustomerName() : "即時客戶");
        orderReq.setCustomerPhone(entity.getCustomerPhone() != null ? entity.getCustomerPhone() : "0900000000");
        orderReq.setAvailabilityId(availabilityId);

        Order order = orderService.createOrder(orderReq, entity.getConsumerId());
        orderService.transition(order.getId(), OrderStatus.PENDING_PAYMENT, "instant_match", "即時媒合成立", "SYSTEM");

        entity.setStatus(MatchRequestStatus.MATCH_FOUND.getCode());
        entity.setMatchedProviderId(providerId);
        entity.setOrderId(order.getId());
        entity.setEstimatedFee(order.getTotalFee());
        matchRequestMapper.updateById(entity);
        cacheRequest(entity);

        MatchRequestDto dto = toDto(entity);
        matchingEventHub.publish(requestId, "MATCH_FOUND", dto);
        broadcastEngine.publish(MatchBroadcastPayload.builder().type("MATCH_CLOSED").requestId(requestId).build());
        notifyService.triggerFlow("instant_match_success", entity.getConsumerId(), "找到攝影師", "請在 5 分鐘內完成付款");
        notifyService.triggerFlow("instant_match_success", providerId, "接單成功", entity.getShootingLocation());
        matchAnalyticsService.track("ACCEPT", requestId, entity.getConsumerId(), providerId,
                entity.getCity(), entity.getServiceTypeId(), Map.of("orderId", order.getId()));

        return dto;
    }

    @Override
    public void declineRequest(Long providerId, Long requestId) {
        log.debug("Provider {} declined request {}", providerId, requestId);
    }

    private void releaseAcceptLockOnRollback(Long requestId) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    stringRedisTemplate.delete(MATCH_ACCEPT_PREFIX + requestId);
                    log.info("接單交易回滾，釋放接單鎖: requestId={}", requestId);
                }
            }
        });
    }

    @Override
    public Map<String, Object> payAfterMatch(Long consumerId, Long requestId) {
        MatchRequest entity = requireRequest(requestId);
        if (!entity.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限");
        }
        if (entity.getOrderId() == null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "尚未媒合成功");
        }
        Map<String, Object> result = new HashMap<>();
        result.put("orderId", entity.getOrderId());
        result.put("checkoutPath", "/payment/ecpay/checkout/" + entity.getOrderId());
        entity.setStatus(MatchRequestStatus.PAYMENT_PENDING.getCode());
        matchRequestMapper.updateById(entity);
        return result;
    }

    @Override
    public Map<String, Object> getStats(Long providerId) {
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        long todayCount = matchRequestMapper.selectCount(new LambdaQueryWrapper<MatchRequest>()
                .eq(MatchRequest::getMatchedProviderId, providerId)
                .ge(MatchRequest::getCreatedAt, LocalDate.now().atStartOfDay()));
        long monthCount = matchRequestMapper.selectCount(new LambdaQueryWrapper<MatchRequest>()
                .eq(MatchRequest::getMatchedProviderId, providerId)
                .ge(MatchRequest::getCreatedAt, monthStart));
        Map<String, Object> stats = new HashMap<>();
        stats.put("todayAccepted", todayCount);
        stats.put("monthAccepted", monthCount);
        stats.put("online", onlineService.isOnline(providerId));
        return stats;
    }

    @Override
    @Transactional
    public void processTimeouts() {
        List<MatchRequest> searching = matchRequestMapper.selectList(new LambdaQueryWrapper<MatchRequest>()
                .eq(MatchRequest::getStatus, MatchRequestStatus.SEARCHING.getCode())
                .le(MatchRequest::getExpiresAt, LocalDateTime.now()));

        for (MatchRequest entity : searching) {
            long ageSeconds = Duration.between(entity.getCreatedAt(), LocalDateTime.now()).getSeconds();
            if (ageSeconds >= 60) {
                fallback(entity);
            } else if (ageSeconds >= 45 && entity.getRadiusKm() < 20) {
                expandBroadcast(entity, 20, 3);
            } else if (ageSeconds >= 30 && entity.getRadiusKm() < 15) {
                expandBroadcast(entity, 15, 2);
            }
        }
    }

    @Override
    public SseEmitter subscribe(Long consumerId, Long requestId) {
        MatchRequest entity = requireRequest(requestId);
        if (!entity.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限");
        }
        return matchingEventHub.subscribe(requestId);
    }

    private void fallback(MatchRequest entity) {
        entity.setStatus(MatchRequestStatus.FALLBACK.getCode());
        matchRequestMapper.updateById(entity);
        MatchRequestDto dto = toDto(entity);
        dto.setFallbackProviders(findFallbackProviders(entity));
        matchingEventHub.publish(entity.getId(), "FALLBACK_TO_SEARCH", dto);
        notifyService.triggerFlow("instant_match_timeout", entity.getConsumerId(), "暫無攝影師回應", "已為您轉為搜尋模式");
        matchAnalyticsService.track("TIMEOUT", entity.getId(), entity.getConsumerId(), null,
                entity.getCity(), entity.getServiceTypeId(), null);
        matchAnalyticsService.track("FALLBACK", entity.getId(), entity.getConsumerId(), null,
                entity.getCity(), entity.getServiceTypeId(), null);
    }

    private void expandBroadcast(MatchRequest entity, int radiusKm, int round) {
        if (entity.getBroadcastRound() >= round) return;
        entity.setRadiusKm(radiusKm);
        entity.setBroadcastRound(round);
        matchRequestMapper.updateById(entity);
        broadcastToProviders(entity);
    }

    private void broadcastToProviders(MatchRequest entity) {
        Set<Long> targets = findTargetProviders(entity);
        webSocketRegistry.registerTargets(entity.getId(), targets);
        for (Long providerId : targets) {
            Provider p = providerMapper.selectById(providerId);
            if (p == null) continue;
            double distance = calcDistance(entity, p);
            int unitPrice = p.getUnitPrice() != null && p.getUnitPrice() > 0 ? p.getUnitPrice() : defaultUnitPrice;
            int income = new BigDecimal(unitPrice).multiply(entity.getDurationHours())
                    .multiply(BigDecimal.valueOf(0.8)).setScale(0, RoundingMode.HALF_UP).intValue();
            MatchBroadcastPayload payload = MatchBroadcastPayload.builder()
                    .type("NEW_REQUEST")
                    .requestId(entity.getId())
                    .serviceTypeId(entity.getServiceTypeId())
                    .shootingLocation(entity.getShootingLocation())
                    .shootingLat(entity.getShootingLat())
                    .shootingLng(entity.getShootingLng())
                    .durationHours(entity.getDurationHours())
                    .scheduledTime(entity.getScheduledTime())
                    .estimatedIncome(income)
                    .distanceKm(Math.round(distance * 10.0) / 10.0)
                    .responseSeconds(RESPONSE_SECONDS)
                    .build();
            webSocketRegistry.sendToProvider(providerId, payload);
        }
    }

    private Set<Long> findTargetProviders(MatchRequest entity) {
        Set<String> onlineIds = onlineService.getOnlinePhotographerIds(entity.getCity());
        if (onlineIds == null || onlineIds.isEmpty()) return Set.of();

        List<ProviderCandidate> candidates = new ArrayList<>();
        for (String idStr : onlineIds) {
            Long providerId = Long.parseLong(idStr);
            Provider p = providerMapper.selectById(providerId);
            if (p == null || !"PHOTOGRAPHER".equals(p.getProviderType()) || !"Y".equals(p.getGoLive())) continue;
            if (p.getRating() != null && p.getRating().doubleValue() < 4.0) continue;
            if (p.getServiceItem() == null || !Arrays.asList(p.getServiceItem().split(",")).contains(entity.getServiceTypeId().toString())) continue;

            double distance = calcDistance(entity, p);
            if (distance > entity.getRadiusKm()) continue;

            LocalDate shootDate = entity.getScheduledTime().toLocalDate();
            LocalTime start = entity.getScheduledTime().toLocalTime().withSecond(0).withNano(0);
            LocalTime end = start.plusMinutes(entity.getDurationHours().multiply(BigDecimal.valueOf(60)).longValue());
            if (!availabilityService.isAvailable(providerId, shootDate, start.toString(), end.toString())) continue;

            candidates.add(new ProviderCandidate(providerId, distance, p));
        }

        return candidates.stream()
                .sorted(Comparator.comparingDouble(c -> c.distance))
                .limit(5)
                .map(c -> c.providerId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private List<MatchRequestDto.FallbackProvider> findFallbackProviders(MatchRequest entity) {
        SearchProviderRequest searchReq = new SearchProviderRequest();
        searchReq.setServiceTypeId(entity.getServiceTypeId());
        searchReq.setConfigurationId(entity.getConfigurationId());
        searchReq.setShootingDate(entity.getScheduledTime().toLocalDate());
        LocalTime start = entity.getScheduledTime().toLocalTime().withSecond(0).withNano(0);
        searchReq.setTimeStart(start.toString());
        searchReq.setTimeEnd(start.plusMinutes(entity.getDurationHours().multiply(BigDecimal.valueOf(60)).longValue()).toString());
        searchReq.setCity(entity.getCity());

        return searchService.searchProviders(searchReq).stream().limit(10).map(r -> MatchRequestDto.FallbackProvider.builder()
                .providerId(r.getProviderId())
                .nickName(r.getNickName())
                .rating(r.getRating() != null ? r.getRating().doubleValue() : null)
                .unitPrice(r.getUnitPrice())
                .build()).collect(Collectors.toList());
    }

    private double calcDistance(MatchRequest entity, Provider p) {
        if (entity.getShootingLat() == null || entity.getShootingLng() == null
                || p.getAddrLat() == null || p.getAddrLng() == null) {
            return 0;
        }
        return GeoUtil.distanceKm(entity.getShootingLat(), entity.getShootingLng(), p.getAddrLat(), p.getAddrLng());
    }

    private Long findAvailabilityId(Long providerId, LocalDate date, LocalTime start, LocalTime end) {
        List<Availability> slots = availabilityMapper.selectList(new LambdaQueryWrapper<Availability>()
                .eq(Availability::getProviderId, providerId)
                .eq(Availability::getScheduleDate, date)
                .eq(Availability::getActive, "Y")
                .isNull(Availability::getLockedByOrderId));
        for (Availability slot : slots) {
            if (!start.isBefore(slot.getSlotStart()) && !end.isAfter(slot.getSlotEnd())) {
                return slot.getId();
            }
        }
        return null;
    }

    private Long resolveConfigurationId(Long serviceTypeId) {
        Configuration config = configurationMapper.selectOne(new LambdaQueryWrapper<Configuration>()
                .eq(Configuration::getShootLocation, "OUTDOOR")
                .last("LIMIT 1"));
        return config != null ? config.getId() : 1L;
    }

    private MatchRequest requireRequest(Long requestId) {
        MatchRequest entity = matchRequestMapper.selectById(requestId);
        if (entity == null) throw new ServiceException(ResultCode.NOT_FOUND, "需求不存在");
        return entity;
    }

    private void cacheRequest(MatchRequest entity) {
        try {
            stringRedisTemplate.opsForValue().set(
                    MATCH_REQUEST_PREFIX + entity.getId(),
                    objectMapper.writeValueAsString(entity),
                    Duration.ofSeconds(60));
        } catch (Exception e) {
            log.warn("Cache match request failed: {}", e.getMessage());
        }
    }

    private MatchRequestDto toDto(MatchRequest entity) {
        MatchRequestDto.MatchedProvider matched = null;
        if (entity.getMatchedProviderId() != null) {
            Provider p = providerMapper.selectById(entity.getMatchedProviderId());
            if (p != null) {
                matched = MatchRequestDto.MatchedProvider.builder()
                        .providerId(p.getId())
                        .nickName(p.getNickName())
                        .avatar(p.getAvatar())
                        .rating(p.getRating() != null ? p.getRating().doubleValue() : null)
                        .distanceKm(calcDistance(entity, p))
                        .estimatedFee(entity.getEstimatedFee())
                        .build();
            }
        }
        int elapsed = (int) Duration.between(entity.getCreatedAt(), LocalDateTime.now()).getSeconds();
        return MatchRequestDto.builder()
                .id(entity.getId())
                .status(entity.getStatus())
                .shootingLocation(entity.getShootingLocation())
                .shootingLat(entity.getShootingLat())
                .shootingLng(entity.getShootingLng())
                .durationHours(entity.getDurationHours())
                .scheduledTime(entity.getScheduledTime())
                .estimatedFee(entity.getEstimatedFee())
                .radiusKm(entity.getRadiusKm())
                .broadcastRound(entity.getBroadcastRound())
                .elapsedSeconds(elapsed)
                .matchedProvider(matched)
                .orderId(entity.getOrderId())
                .build();
    }

    private record ProviderCandidate(Long providerId, double distance, Provider provider) {}
}
