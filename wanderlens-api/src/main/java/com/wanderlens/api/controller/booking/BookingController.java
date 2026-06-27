package com.wanderlens.api.controller.booking;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Configuration;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.ServiceType;
import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SearchProviderResult;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.ConfigurationService;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.SearchService;
import com.wanderlens.api.service.ServiceTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 預約與媒合 API
 */
@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "預約與媒合")
public class BookingController {

    private final ServiceTypeService serviceTypeService;
    private final ConfigurationService configurationService;
    private final SearchService searchService;
    private final AvailabilityService availabilityService;
    private final OrderService orderService;

    // ── 拍攝類型 ──

    @GetMapping("/service-types")
    @Operation(summary = "拍攝類型列表")
    public Result<List<ServiceType>> listServiceTypes() {
        return Result.ok(serviceTypeService.listActive());
    }

    @GetMapping("/service-types/{id}/suggested-config")
    @Operation(summary = "類型建議配置")
    public Result<String> getSuggestedConfig(@PathVariable Long id) {
        return Result.ok(serviceTypeService.getSuggestedConfig(id));
    }

    // ── 配置 ──

    @GetMapping("/configurations")
    @Operation(summary = "配置列表")
    public Result<List<Configuration>> listConfigurations() {
        return Result.ok(configurationService.list());
    }

    // ── 搜尋 ──

    @PostMapping("/providers")
    @Operation(summary = "依條件搜尋可用攝影師", description = "階段一僅搜尋攝影師池")
    public Result<List<SearchProviderResult>> searchProviders(@Valid @RequestBody SearchProviderRequest request) {
        return Result.ok(searchService.searchProviders(request));
    }

    // ── 時段鎖定（需認證） ──

    @PostMapping("/booking/lock")
    @Operation(summary = "鎖定時段（選到即確定）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Boolean> lockSlot(HttpServletRequest httpRequest,
                                     @RequestParam Long availabilityId,
                                     @RequestParam Long orderId) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        // 驗證訂單屬於當前使用者
        Order order = orderService.getById(orderId);
        if (order == null) {
            return Result.error(ResultCode.ORDER_NOT_FOUND.getCode(), ResultCode.ORDER_NOT_FOUND.getMessage());
        }
        if (!order.getConsumerId().equals(userId)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限鎖定此訂單的時段");
        }
        return Result.ok(availabilityService.lockSlot(availabilityId, orderId));
    }

    @PostMapping("/booking/unlock")
    @Operation(summary = "解鎖時段（取消預約）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Boolean> unlockSlot(HttpServletRequest httpRequest,
                                      @RequestParam Long availabilityId) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        String role = (String) httpRequest.getAttribute("role");
        // 管理員可直接解鎖
        if ("ADMIN".equals(role) || "SUPPORT".equals(role)) {
            return Result.ok(availabilityService.unlockSlot(availabilityId));
        }
        // 一般使用者：驗證是否為該時段的鎖定者
        // 透過 availabilityId 查該時段被哪個訂單鎖定，再驗證訂單擁有者
        com.wanderlens.api.entity.Availability slot = availabilityService.getById(availabilityId);
        if (slot == null) {
            return Result.error(ResultCode.SLOT_NOT_FOUND.getCode(), ResultCode.SLOT_NOT_FOUND.getMessage());
        }
        if (slot.getLockedByOrderId() != null) {
            com.wanderlens.api.entity.Order order = orderService.getById(slot.getLockedByOrderId());
            if (order == null || !order.getConsumerId().equals(userId)) {
                return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限解鎖此時段");
            }
        }
        return Result.ok(availabilityService.unlockSlot(availabilityId));
    }
}