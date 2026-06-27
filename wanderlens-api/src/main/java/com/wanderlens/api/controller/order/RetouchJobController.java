package com.wanderlens.api.controller.order;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.RetouchJob;
import com.wanderlens.api.service.RetouchJobService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 精修工單 API
 */
@RestController
@RequestMapping("/retouch/jobs")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Retouch", description = "精修工單")
public class RetouchJobController {

    private final RetouchJobService retouchJobService;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "工單列表（依狀態）")
    public Result<List<RetouchJob>> list(HttpServletRequest request,
                                         @RequestParam(required = false) String status) {
        String role = authUtil.getRole(request);
        Long userId = authUtil.getUserId(request);

        // 外包修圖公司只能看自己的工單
        if ("RETOUCH".equals(role)) {
            return Result.ok(retouchJobService.listByCompanyId(userId));
        }
        // ADMIN/SUPPORT 可看全部
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role) && !"CONSUMER".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看工單列表");
        }
        if ("CONSUMER".equals(role)) {
            return Result.ok(retouchJobService.listByConsumerId(userId));
        }
        return Result.ok(retouchJobService.list());
    }

    @GetMapping("/{id}")
    @Operation(summary = "工單詳情")
    public Result<RetouchJob> get(HttpServletRequest request, @PathVariable Long id) {
        RetouchJob job = retouchJobService.getById(id);
        if (job == null) {
            return Result.error(ResultCode.RETOUCH_JOB_NOT_FOUND.getCode(), ResultCode.RETOUCH_JOB_NOT_FOUND.getMessage());
        }
        String role = authUtil.getRole(request);
        Long userId = authUtil.getUserId(request);

        // 消費者只能看自己的工單
        if ("CONSUMER".equals(role) && !userId.equals(job.getConsumerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看此工單");
        }
        // 修圖公司只能看自己的工單
        if ("RETOUCH".equals(role) && !userId.equals(job.getRetouchCompanyId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看此工單");
        }
        return Result.ok(job);
    }

    @PostMapping
    @Operation(summary = "建立精修工單（消費者選片）")
    public Result<RetouchJob> create(HttpServletRequest request,
            @RequestParam Long orderId,
            @RequestParam String mediaAssetIds,
            @RequestParam(required = false) String spec,
            @RequestParam(required = false) Integer fee) {
        // consumerId 從 JWT 取得，不接受 query param
        Long consumerId = authUtil.getUserId(request);
        return Result.ok(retouchJobService.createJob(orderId, consumerId, mediaAssetIds, spec, fee));
    }

    @PostMapping("/{id}/assign")
    @Operation(summary = "派工（後台）")
    public Result<RetouchJob> assign(HttpServletRequest request,
            @PathVariable Long id,
            @RequestParam Long retouchCompanyId,
            @RequestParam String deliveryDeadline) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(retouchJobService.assign(id, retouchCompanyId, LocalDateTime.parse(deliveryDeadline)));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "開始處理（外包公司）")
    public Result<RetouchJob> startProcessing(HttpServletRequest request, @PathVariable Long id) {
        // 驗證修圖公司擁有此工單
        RetouchJob job = retouchJobService.getById(id);
        if (job == null) {
            return Result.error(ResultCode.RETOUCH_JOB_NOT_FOUND.getCode(), ResultCode.RETOUCH_JOB_NOT_FOUND.getMessage());
        }
        Long userId = authUtil.getUserId(request);
        if (!userId.equals(job.getRetouchCompanyId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限操作此工單");
        }
        return Result.ok(retouchJobService.startProcessing(id));
    }

    @PostMapping("/{id}/deliver")
    @Operation(summary = "交付成品（外包公司）")
    public Result<RetouchJob> deliver(HttpServletRequest request, @PathVariable Long id) {
        // 驗證修圖公司擁有此工單
        RetouchJob job = retouchJobService.getById(id);
        if (job == null) {
            return Result.error(ResultCode.RETOUCH_JOB_NOT_FOUND.getCode(), ResultCode.RETOUCH_JOB_NOT_FOUND.getMessage());
        }
        Long userId = authUtil.getUserId(request);
        if (!userId.equals(job.getRetouchCompanyId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限操作此工單");
        }
        return Result.ok(retouchJobService.deliver(id));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "退修（後台）")
    public Result<RetouchJob> reject(HttpServletRequest request, @PathVariable Long id, @RequestParam String reason) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT");
        return Result.ok(retouchJobService.reject(id, reason));
    }

    @PostMapping("/{id}/settle")
    @Operation(summary = "結算（後台）")
    public Result<RetouchJob> settle(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireRole(request, "ADMIN", "FINANCE");
        return Result.ok(retouchJobService.settle(id));
    }
}