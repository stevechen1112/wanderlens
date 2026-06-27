package com.wanderlens.api.controller.provider;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.*;
import com.wanderlens.api.entity.dto.AddProviderWorkRequest;
import com.wanderlens.api.entity.dto.ProviderEarningsDto;
import com.wanderlens.api.entity.dto.ProviderWorksViewDto;
import com.wanderlens.api.entity.dto.RatingSummaryDto;
import com.wanderlens.api.entity.dto.SaveServiceAreaRequest;
import com.wanderlens.api.entity.dto.ServiceAreaResponse;
import com.wanderlens.api.entity.dto.SetScheduleRequest;
import com.wanderlens.api.entity.dto.SubmitRatingRequest;
import com.wanderlens.api.service.ProviderProfileService;
import com.wanderlens.api.util.ProviderIdResolver;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.ProviderAreaService;
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
    private final ProviderAreaService providerAreaService;
    private final ProviderProfileService providerProfileService;
    private final ProviderIdResolver providerIdResolver;
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
        patchProvider(existing, body);
        providerService.updateById(existing);
        return Result.ok(existing);
    }

    private void patchProvider(Provider target, Provider patch) {
        if (patch.getName() != null) target.setName(patch.getName());
        if (patch.getNickName() != null) target.setNickName(patch.getNickName());
        if (patch.getNickNameEn() != null) target.setNickNameEn(patch.getNickNameEn());
        if (patch.getNickNameJp() != null) target.setNickNameJp(patch.getNickNameJp());
        if (patch.getNickNameKr() != null) target.setNickNameKr(patch.getNickNameKr());
        if (patch.getEmail() != null) target.setEmail(patch.getEmail());
        if (patch.getCity() != null) target.setCity(patch.getCity());
        if (patch.getDistrictName() != null) target.setDistrictName(patch.getDistrictName());
        if (patch.getAddress() != null) target.setAddress(patch.getAddress());
        if (patch.getAddrLng() != null) target.setAddrLng(patch.getAddrLng());
        if (patch.getAddrLat() != null) target.setAddrLat(patch.getAddrLat());
        if (patch.getIntro() != null) target.setIntro(patch.getIntro());
        if (patch.getIntroEn() != null) target.setIntroEn(patch.getIntroEn());
        if (patch.getIntroJp() != null) target.setIntroJp(patch.getIntroJp());
        if (patch.getIntroKr() != null) target.setIntroKr(patch.getIntroKr());
        if (patch.getAvatar() != null) target.setAvatar(patch.getAvatar());
        if (patch.getBannerImg() != null) target.setBannerImg(patch.getBannerImg());
        if (patch.getCareer() != null) target.setCareer(patch.getCareer());
        if (patch.getExperience() != null) target.setExperience(patch.getExperience());
        if (patch.getUnitPrice() != null) target.setUnitPrice(patch.getUnitPrice());
        if (patch.getServiceItem() != null) target.setServiceItem(patch.getServiceItem());
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
    @Operation(summary = "服務地區（樹狀 + 已選，或 flat 列表）")
    public Result<?> getServiceAreas(HttpServletRequest request,
                                     @PathVariable Long providerId,
                                     @RequestParam(defaultValue = "tree") String view) {
        authUtil.requireProviderOrAdmin(request, providerId);
        if ("flat".equalsIgnoreCase(view)) {
            return Result.ok(providerAreaMapper.selectList(
                    new LambdaQueryWrapper<ProviderArea>().eq(ProviderArea::getProviderId, providerId)));
        }
        return Result.ok(providerAreaService.getServiceArea(providerId));
    }

    @PostMapping("/service-area/{providerId}")
    @Operation(summary = "儲存服務地區")
    public Result<Void> saveServiceAreas(HttpServletRequest request,
                                         @PathVariable Long providerId,
                                         @Valid @RequestBody SaveServiceAreaRequest body) {
        authUtil.requireProviderOrAdmin(request, providerId);
        providerAreaService.saveServiceArea(providerId, body);
        return Result.ok();
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

    @PostMapping("/bank")
    @Operation(summary = "儲存匯款資料")
    public Result<ProviderBank> saveBank(HttpServletRequest request,
                                         @RequestBody ProviderBank body,
                                         @RequestParam(required = false) Long providerId) {
        Long pid = body.getProviderId() != null ? body.getProviderId() : resolveProviderId(request, providerId);
        authUtil.requireProviderOrAdmin(request, pid);
        return Result.ok(providerProfileService.saveBank(pid, body));
    }

    @GetMapping("/feature/{providerId}")
    @Operation(summary = "特色資料列表")
    public Result<List<ProviderFeature>> getFeatures(HttpServletRequest request,
                                                     @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        LambdaQueryWrapper<ProviderFeature> qw = new LambdaQueryWrapper<ProviderFeature>()
                .eq(ProviderFeature::getProviderId, providerId)
                .orderByAsc(ProviderFeature::getSort);
        return Result.ok(providerFeatureMapper.selectList(qw));
    }

    @PostMapping("/feature")
    @Operation(summary = "新增或更新特色資料")
    public Result<ProviderFeature> saveFeature(HttpServletRequest request,
                                             @RequestBody ProviderFeature body) {
        if (body.getProviderId() == null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "缺少 providerId");
        }
        authUtil.requireProviderOrAdmin(request, body.getProviderId());
        return Result.ok(providerProfileService.saveFeature(body.getProviderId(), body));
    }

    @DeleteMapping("/feature/{featureId}")
    @Operation(summary = "刪除特色資料")
    public Result<Void> deleteFeature(HttpServletRequest request,
                                      @PathVariable Long featureId,
                                      @RequestParam Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        providerProfileService.deleteFeature(providerId, featureId);
        return Result.ok();
    }

    @GetMapping("/works/{providerId}")
    @Operation(summary = "作品集列表")
    public Result<List<ProviderWorksViewDto>> getWorks(HttpServletRequest request,
                                                       @PathVariable Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        return Result.ok(providerProfileService.listWorksWithUrls(providerId));
    }

    @PostMapping("/works")
    @Operation(summary = "新增作品集")
    public Result<ProviderWorksViewDto> addWork(HttpServletRequest request,
                                                @Valid @RequestBody AddProviderWorkRequest body) {
        authUtil.requireProviderOrAdmin(request, body.getProviderId());
        return Result.ok(providerProfileService.addWork(body.getProviderId(), body));
    }

    @DeleteMapping("/works/{workId}")
    @Operation(summary = "刪除作品集")
    public Result<Void> deleteWork(HttpServletRequest request,
                                   @PathVariable Long workId,
                                   @RequestParam Long providerId) {
        authUtil.requireProviderOrAdmin(request, providerId);
        providerProfileService.deleteWork(providerId, workId);
        return Result.ok();
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
        return providerIdResolver.resolve(request);
    }
}
