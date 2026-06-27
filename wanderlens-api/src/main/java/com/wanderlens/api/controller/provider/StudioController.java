package com.wanderlens.api.controller.provider;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Studio;
import com.wanderlens.api.entity.StudioAvailability;
import com.wanderlens.api.entity.dto.SetStudioScheduleRequest;
import com.wanderlens.api.service.StudioService;
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
 * 攝影棚 API
 */
@RestController
@RequestMapping("/studios")
@RequiredArgsConstructor
@Tag(name = "Studio", description = "攝影棚供給池")
public class StudioController {

    private final StudioService studioService;
    private final AuthUtil authUtil;

    @GetMapping("/search")
    @Operation(summary = "搜尋可用攝影棚")
    public Result<List<Studio>> searchAvailable(
            @RequestParam String date,
            @RequestParam String timeStart,
            @RequestParam String timeEnd,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Long serviceTypeId) {
        return Result.ok(studioService.searchAvailable(
                java.time.LocalDate.parse(date), timeStart, timeEnd, city, serviceTypeId));
    }

    @GetMapping("/{uuid}")
    @Operation(summary = "依 UUID 取得攝影棚")
    public Result<Studio> getByUuid(@PathVariable String uuid) {
        return Result.ok(studioService.findByUuid(uuid));
    }

    @PostMapping
    @Operation(summary = "建立/更新攝影棚（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Studio> save(HttpServletRequest request, @RequestBody Studio studio) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        studioService.saveOrUpdate(studio);
        return Result.ok(studio);
    }

    @PostMapping("/live")
    @Operation(summary = "設定上架狀態（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> setLive(HttpServletRequest request, @RequestParam Long studioId, @RequestParam boolean live) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        studioService.setLive(studioId, live);
        return Result.ok();
    }

    @GetMapping("/{studioId}/schedule")
    @Operation(summary = "攝影棚檔期列表")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<StudioAvailability>> getSchedule(HttpServletRequest request, @PathVariable Long studioId) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        return Result.ok(studioService.getSchedule(studioId));
    }

    @PostMapping("/schedule")
    @Operation(summary = "批次設定攝影棚檔期")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Map<String, Object>> setSchedule(HttpServletRequest request,
                                                      @Valid @RequestBody SetStudioScheduleRequest body) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        int created = studioService.batchCreateSlots(body.getStudioId(), body.getDates(),
                body.getSlotStart(), body.getSlotEnd());
        return Result.ok(Map.of("created", created));
    }

    @DeleteMapping("/schedule/{slotId}")
    @Operation(summary = "刪除攝影棚檔期")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteSchedule(HttpServletRequest request,
                                       @PathVariable Long slotId,
                                       @RequestParam Long studioId) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
        studioService.deleteSlot(studioId, slotId);
        return Result.ok();
    }
}