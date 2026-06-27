package com.wanderlens.api.controller.provider;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.*;
import com.wanderlens.api.entity.dto.ProviderEarningsDto;
import com.wanderlens.api.entity.dto.RatingSummaryDto;
import com.wanderlens.api.entity.dto.SetScheduleRequest;
import com.wanderlens.api.entity.dto.SubmitRatingRequest;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.ProviderRatingService;
import com.wanderlens.api.service.ProviderService;
import com.wanderlens.api.util.AuthUtil;
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
 * 攝影師帳戶管理 API（Provider 端 + Admin 後台）
 */
@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "ProviderAccount", description = "攝影師帳戶管理")
public class ProviderAccountController {

    private final ProviderService providerService;
    private final ProviderRatingService providerRatingService;
    private final OrderService orderService;
    private final ProviderAreaMapper providerAreaMapper;
    private final ProviderBankMapper providerBankMapper;
    private final ProviderFeatureMapper providerFeatureMapper;
    private final ProviderWorksMapper providerWorksMapper;
    private final AvailabilityMapper availabilityMapper;
    private final AvailabilityService availabilityService;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "攝影師列表（後台）")
    public Result<List<Provider>> list(HttpServletRequest request,
                                       @RequestParam(required = false) String providerType) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        LambdaQueryWrapper<Provider> qw = new LambdaQueryWrapper<>();
        if (providerType != null && !providerType.isBlank()) {
            qw.eq(Provider::getProviderType, providerType);
        }
        qw.orderByDesc(Provider::getCreatedAt);
        return Result.ok(providerService.list(qw));
    }

    @GetMapping("/{id}")
    @Operation(summary = "取得攝影師詳情")
    public Result<Provider> getById(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireProviderOrAdmin(request, id);
        Provider provider = providerService.getById(id);
        if (provider == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }
        return Result.ok(provider);
    }

    @PostMapping
    @Operation(summary = "更新攝影師資料")
    public Result<Provider> update(HttpServletRequest request, @RequestBody Provider body) {
        if (body.getId() == null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "缺少 provider id");
        }
        authUtil.requireProviderOrAdmin(request, body.getId());
        Provider existing = providerService.getById(body.getId());
        if (existing == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }
        existing.setName(body.getName());
        existing.setNickName(body.getNickName());
        existing.setNickNameEn(body.getNickNameEn());
        existing.setNickNameJp(body.getNickNameJp());
        existing.setNickNameKr(body.getNickNameKr());
        existing.setEmail(body.getEmail());
        existing.setCity(body.getCity());
        existing.setDistrictName(body.getDistrictName());
        existing.setAddress(body.getAddress());
        existing.setAddrLng(body.getAddrLng());
        existing.setAddrLat(body.getAddrLat());
        existing.setIntro(body.getIntro());
        existing.setIntroEn(body.getIntroEn());
        existing.setIntroJp(body.getIntroJp());
        existing.setIntroKr(body.getIntroKr());
        existing.setAvatar(body.getAvatar());
        existing.setBannerImg(body.getBannerImg());
        providerService.updateById(existing);
        return Result.ok(existing);
    }

    @PostMapping("/live")
    @Operation(summary = "設定上架狀態（後台）")
    public Result<Void> setLive(HttpServletRequest request,
                                @RequestParam Long providerId,
                                @RequestParam boolean live) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        providerService.setLive(providerId, live);
        return Result.ok();
    }

    @GetMapping("/{providerId}/schedule")
    @Operation(summary = "接案時段列表")
    public Result<List<Availability>> getSchedule(HttpServletRequest request,
                                                  @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        List<Availability> slots = availabilityMapper.selectList(
                new LambdaQueryWrapper<Availability>()
                        .eq(Availability::getProviderId, providerId)
                        .orderByAsc(Availability::getScheduleDate)
                        .orderByAsc(Availability::getSlotStart));
        return Result.ok(slots);
    }

    @PostMapping("/schedule")
    @Operation(summary = "設定接案時段（支援批次）")
    public Result<Map<String, Object>> setSchedule(HttpServletRequest request,
                                                    @Valid @RequestBody SetScheduleRequest body) {
        authUtil.requireProviderOrAdmin(request, body.getProviderId());
        int created = availabilityService.batchCreateSlots(
                body.getProviderId(), body.getDates(), body.getSlotStart(), body.getSlotEnd());
        return Result.ok(Map.of("created", created));
    }

    @PostMapping("/schedule/block")
    @Operation(summary = "封鎖時段（支援批次）")
    public Result<Map<String, Object>> blockSchedule(HttpServletRequest request,
                                                       @Valid @RequestBody SetScheduleRequest body) {
        authUtil.requireProviderOrAdmin(request, body.getProviderId());
        int created = availabilityService.batchBlockSlots(
                body.getProviderId(), body.getDates(), body.getSlotStart(), body.getSlotEnd());
        return Result.ok(Map.of("blocked", created));
    }

    @DeleteMapping("/schedule/{slotId}")
    @Operation(summary = "刪除接案時段")
    public Result<Void> deleteSchedule(HttpServletRequest request,
                                       @PathVariable Long slotId,
                                       @RequestParam Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        availabilityService.deleteSlot(providerId, slotId);
        return Result.ok();
    }

    @GetMapping("/service-area/{providerId}")
    @Operation(summary = "服務地區列表")
    public Result<List<ProviderArea>> getServiceAreas(HttpServletRequest request,
                                                      @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerAreaMapper.selectList(
                new LambdaQueryWrapper<ProviderArea>().eq(ProviderArea::getProviderId, providerId)));
    }

    @GetMapping("/bank")
    @Operation(summary = "匯款資料")
    public Result<ProviderBank> getBank(HttpServletRequest request,
                                        @RequestParam(required = false) Long providerId) {
        Long pid = resolveProviderId(request, providerId);
        authUtil.requireProviderOrAdmin(request, pid);
        ProviderBank bank = providerBankMapper.selectOne(
                new LambdaQueryWrapper<ProviderBank>().eq(ProviderBank::getProviderId, pid));
        return Result.ok(bank);
    }

    @GetMapping("/feature/{providerId}")
    @Operation(summary = "特色資料列表")
    public Result<List<ProviderFeature>> getFeatures(HttpServletRequest request,
                                                     @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerFeatureMapper.selectList(
                new LambdaQueryWrapper<ProviderFeature>()
                        .eq(ProviderFeature::getProviderId, providerId)
                        .orderByAsc(ProviderFeature::getSort)));
    }

    @GetMapping("/works/{providerId}")
    @Operation(summary = "作品集列表")
    public Result<List<ProviderWorks>> getWorks(HttpServletRequest request,
                                                @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerWorksMapper.selectList(
                new LambdaQueryWrapper<ProviderWorks>()
                        .eq(ProviderWorks::getProviderId, providerId)
                        .orderByAsc(ProviderWorks::getSortOrder)));
    }

    @GetMapping("/rating/{providerId}")
    @Operation(summary = "評價摘要")
    public Result<RatingSummaryDto> getRatingSummary(HttpServletRequest request,
                                                      @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerRatingService.getSummary(providerId));
    }

    @GetMapping("/rating/{providerId}/list")
    @Operation(summary = "評價列表")
    public Result<List<ProviderRating>> getRatings(HttpServletRequest request,
                                                    @PathVariable Long providerId,
                                                    @RequestParam(defaultValue = "1") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerRatingService.getByProviderId(providerId, page, size));
    }

    @PostMapping("/ratings")
    @Operation(summary = "提交評價")
    public Result<ProviderRating> submitRating(HttpServletRequest request,
                                                @Valid @RequestBody SubmitRatingRequest body) {
        Long consumerId = (Long) request.getAttribute("userId");
        return Result.ok(providerRatingService.submitRating(
                consumerId, body.getOrderId(), body.getProviderId(), body.getStars(), body.getComments()));
    }

    @GetMapping("/{providerId}/earnings")
    @Operation(summary = "攝影師收益儀表板")
    public Result<ProviderEarningsDto> getEarnings(HttpServletRequest request, @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getPhotographerId, providerId)
                .notIn(Order::getStatus,
                        OrderStatus.CANCELLED.getCode(),
                        OrderStatus.REFUNDED.getCode())
                .orderByDesc(Order::getCreatedAt));
        String monthPrefix = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
        int monthly = 0, total = 0, pending = 0, withdrawable = 0;
        java.util.List<ProviderEarningsDto.EarningItemDto> items = new java.util.ArrayList<>();
        for (Order o : orders) {
            int profit = o.getPhotographerProfit() != null ? o.getPhotographerProfit() : 0;
            if (profit <= 0) continue;
            boolean settled = OrderStatus.CLOSED.getCode().equals(o.getStatus())
                    || OrderStatus.DELIVERED.getCode().equals(o.getStatus());
            total += profit;
            if (!settled) pending += profit;
            if (settled) withdrawable += profit;
            String dateKey = o.getShootingDate() != null ? o.getShootingDate().toString() : "";
            if (dateKey.startsWith(monthPrefix) || (o.getCreatedAt() != null && o.getCreatedAt().toString().startsWith(monthPrefix))) {
                monthly += profit;
            }
            items.add(ProviderEarningsDto.EarningItemDto.builder()
                    .orderId(o.getId())
                    .orderNo(o.getOrderNo())
                    .status(o.getStatus())
                    .shootingDate(dateKey)
                    .amount(profit)
                    .settled(settled)
                    .build());
        }
        return Result.ok(ProviderEarningsDto.builder()
                .monthlyEarnings(monthly)
                .totalEarnings(total)
                .pendingSettlement(pending)
                .withdrawable(withdrawable)
                .items(items.stream().limit(50).toList())
                .build());
    }

    @GetMapping("/schedules/all")
    @Operation(summary = "全部攝影師檔期總覽（後台）")
    public Result<List<Availability>> allSchedules(HttpServletRequest request,
                                                     @RequestParam(required = false) String month) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        LambdaQueryWrapper<Availability> qw = new LambdaQueryWrapper<>();
        if (month != null && month.matches("\\d{4}-\\d{2}")) {
            qw.apply("DATE_FORMAT(schedule_date, '%Y-%m') = {0}", month);
        }
        qw.orderByAsc(Availability::getScheduleDate);
        return Result.ok(availabilityMapper.selectList(qw));
    }

    private Long resolveProviderId(HttpServletRequest request, Long providerId) {
        String role = authUtil.getRole(request);
        if ("ADMIN".equals(role) || "SUPPORT".equals(role) || "EDITOR".equals(role)) {
            if (providerId == null) {
                throw new ServiceException(ResultCode.BAD_REQUEST, "後台查詢需指定 providerId");
            }
            return providerId;
        }
        return authUtil.getUserId(request);
    }
}
