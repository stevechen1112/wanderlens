package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.Availability;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.ProviderArea;
import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SearchProviderResult;
import com.wanderlens.api.entity.enums.ProviderType;
import com.wanderlens.api.mapper.AvailabilityMapper;
import com.wanderlens.api.mapper.ProviderAreaMapper;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.SearchService;
import com.wanderlens.api.util.GoogleMapsUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final ProviderMapper providerMapper;
    private final AvailabilityMapper availabilityMapper;
    private final ProviderAreaMapper providerAreaMapper;
    private final AvailabilityService availabilityService;
    private final GoogleMapsUtil googleMapsUtil;

    @Value("${wanderlens.pricing.default-unit-price:800}")
    private Integer defaultUnitPrice;

    @Value("${wanderlens.pricing.default-transportation-fee:0}")
    private Integer defaultTransportationFee;

    @Override
    public List<SearchProviderResult> searchProviders(SearchProviderRequest request) {
        // ── 輸入驗證 ──
        if (request.getShootingDate() == null) {
            throw new IllegalArgumentException("拍攝日期不可為空");
        }
        if (request.getTimeStart() == null || request.getTimeEnd() == null) {
            throw new IllegalArgumentException("起訖時間不可為空");
        }

        LocalDate date = request.getShootingDate();
        LocalTime startTime = LocalTime.parse(request.getTimeStart());
        LocalTime endTime = LocalTime.parse(request.getTimeEnd());

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("結束時間必須晚於開始時間");
        }

        // 計算時長（支援小數小時，精確到 0.5 小時）
        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        BigDecimal durationHours = BigDecimal.valueOf(durationMinutes)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        // 1. 查符合類型的上架攝影師
        // 使用 FIND_IN_SET 精確匹配 serviceItemId，避免 LIKE '1' 匹配到 '11','21'
        LambdaQueryWrapper<Provider> providerWrapper = new LambdaQueryWrapper<Provider>()
                .eq(Provider::getProviderType, ProviderType.PHOTOGRAPHER.getCode())
                .eq(Provider::getGoLive, "Y")
                .and(w -> w.isNull(Provider::getViolationLevel)
                        .or().eq(Provider::getViolationLevel, "NONE")
                        .or().eq(Provider::getViolationLevel, "WARNING"))
                .apply("FIND_IN_SET({0}, service_item)", request.getServiceTypeId().toString());

        if (request.getCity() != null && !request.getCity().isEmpty()) {
            providerWrapper.eq(Provider::getCity, request.getCity());
        }

        List<Provider> providers = providerMapper.selectList(providerWrapper);

        // 2. 依服務地區過濾
        if (request.getAreaId() != null) {
            List<Long> providerIdsInArea = providerAreaMapper.selectList(
                    new LambdaQueryWrapper<ProviderArea>()
                            .eq(ProviderArea::getAreaId, request.getAreaId()))
                    .stream()
                    .map(ProviderArea::getProviderId)
                    .collect(Collectors.toList());
            providers = providers.stream()
                    .filter(p -> providerIdsInArea.contains(p.getId()))
                    .collect(Collectors.toList());
        }

        // 3. 依時段可用性過濾，組裝結果
        List<SearchProviderResult> results = new ArrayList<>();
        for (Provider provider : providers) {
            boolean available = availabilityService.isAvailable(
                    provider.getId(), date, request.getTimeStart(), request.getTimeEnd());

            if (available) {
                SearchProviderResult result = new SearchProviderResult();
                result.setProviderId(provider.getId());
                result.setProviderUuid(provider.getProviderUuid());
                result.setNickName(provider.getNickName());
                result.setCity(provider.getCity());
                result.setAvatar(provider.getAvatar());
                result.setBannerImg(provider.getBannerImg());
                result.setRating(provider.getRating());
                result.setAvailable(true);

                // 定價：攝影師自訂優先，否則平台預設
                int unitPrice = provider.getUnitPrice() != null && provider.getUnitPrice() > 0
                        ? provider.getUnitPrice() : defaultUnitPrice;
                result.setUnitPrice(unitPrice);

                int transportationFee = resolveTransportationFee(request, provider);
                result.setTransportationFee(transportationFee);

                // 總費用 = 時長 × 單價 + 交通費（支援小數小時）
                BigDecimal totalFee = durationHours
                        .multiply(BigDecimal.valueOf(unitPrice))
                        .add(BigDecimal.valueOf(transportationFee))
                        .setScale(0, RoundingMode.HALF_UP);
                result.setTotalFee(totalFee.intValue());
                result.setAvailabilityId(findAvailabilityId(provider.getId(), date, request.getTimeStart(), request.getTimeEnd()));

                results.add(result);
            }
        }

        // 4. 排序：依評價降序
        results.sort(Comparator.comparing(
                SearchProviderResult::getRating,
                Comparator.nullsLast(Comparator.reverseOrder())));

        // 5. 分頁（含邊界驗證）
        int page = request.getPage() != null ? Math.max(1, request.getPage()) : 1;
        int pageSize = request.getPageSize() != null ? Math.max(1, Math.min(request.getPageSize(), 100)) : 20;
        int fromIndex = Math.min((page - 1) * pageSize, results.size());
        int toIndex = Math.min(fromIndex + pageSize, results.size());
        List<SearchProviderResult> pagedResults = results.subList(fromIndex, toIndex);

        log.info("搜尋攝影師: date={}, city={}, totalMatches={}, page={}, pageSize={}, returned={}",
                date, request.getCity(), results.size(), page, pageSize, pagedResults.size());
        return pagedResults;
    }

    private int resolveTransportationFee(SearchProviderRequest request, Provider provider) {
        String destination = buildDestination(request);
        if (destination == null) {
            return defaultTransportationFee;
        }
        String origin = buildProviderOrigin(provider);
        if (origin == null) {
            return defaultTransportationFee;
        }
        try {
            long distanceMeters = googleMapsUtil.getDrivingDistance(origin, destination);
            if (distanceMeters <= 0) {
                return defaultTransportationFee;
            }
            return googleMapsUtil.calculateTransportationFee(distanceMeters, 5, 650);
        } catch (Exception e) {
            log.warn("交通費計算失敗，使用預設值: origin={}, destination={}", origin, destination, e);
            return defaultTransportationFee;
        }
    }

    private String buildDestination(SearchProviderRequest request) {
        if (request.getLat() != null && request.getLng() != null) {
            return request.getLat() + "," + request.getLng();
        }
        if (request.getShootingLocation() != null && !request.getShootingLocation().isBlank()) {
            return request.getShootingLocation();
        }
        if (request.getCity() != null && !request.getCity().isBlank()) {
            return request.getCity();
        }
        return null;
    }

    private String buildProviderOrigin(Provider provider) {
        if (provider.getAddrLat() != null && provider.getAddrLng() != null) {
            return provider.getAddrLat() + "," + provider.getAddrLng();
        }
        if (provider.getAddress() != null && !provider.getAddress().isBlank()) {
            return provider.getCity() + provider.getAddress();
        }
        if (provider.getCity() != null && !provider.getCity().isBlank()) {
            return provider.getCity();
        }
        return null;
    }

    private Long findAvailabilityId(Long providerId, LocalDate date, String start, String end) {
        LocalTime startTime = LocalTime.parse(start);
        LocalTime endTime = LocalTime.parse(end);
        List<Availability> slots = availabilityMapper.selectList(new LambdaQueryWrapper<Availability>()
                .eq(Availability::getProviderId, providerId)
                .eq(Availability::getScheduleDate, date)
                .eq(Availability::getActive, "Y")
                .isNull(Availability::getLockedByOrderId));
        for (Availability slot : slots) {
            if (!startTime.isBefore(slot.getSlotStart()) && !endTime.isAfter(slot.getSlotEnd())) {
                return slot.getId();
            }
        }
        return null;
    }
}