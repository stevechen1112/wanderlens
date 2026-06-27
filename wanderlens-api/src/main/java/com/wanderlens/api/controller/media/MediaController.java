package com.wanderlens.api.controller.media;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.dto.AiCompleteRequest;
import com.wanderlens.api.service.MediaInterfaceService;
import com.wanderlens.api.util.AuthUtil;
import com.wanderlens.api.util.ProviderIdResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "媒體管線介面")
public class MediaController {

    private final MediaInterfaceService mediaInterfaceService;
    private final AuthUtil authUtil;
    private final ProviderIdResolver providerIdResolver;

    @Value("${wanderlens.media.service-api-key:}")
    private String mediaServiceApiKey;

    /**
     * 驗證服務間 API Key（media → api 的內部呼叫）
     */
    private boolean validateServiceApiKey(HttpServletRequest request) {
        String apiKey = request.getHeader("X-Service-API-Key");
        return apiKey != null && !apiKey.isEmpty() && apiKey.equals(mediaServiceApiKey);
    }

    @PostMapping("/upload-token")
    @Operation(summary = "核發上傳憑證（給 provider）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> issueUploadToken(HttpServletRequest request,
                                           @RequestParam Long orderId,
                                           @RequestParam String assetType) {
        Long providerId = providerIdResolver.resolve(request);

        // 驗證 assetType 合法值
        if (!"RAW".equals(assetType) && !"JPEG".equals(assetType) && !"PROOF".equals(assetType)) {
            return Result.error(ResultCode.BAD_REQUEST.getCode(), "無效的 assetType，僅支援 RAW/JPEG/PROOF");
        }

        return Result.ok(mediaInterfaceService.issueUploadToken(orderId, providerId, assetType));
    }

    @PostMapping("/verify")
    @Operation(summary = "驗收回報（media→api）", description = "僅限 media 服務以 X-Service-API-Key 呼叫")
    public Result<Void> verify(HttpServletRequest request,
                               @RequestParam Long orderId,
                               @RequestParam boolean success,
                               @RequestParam int fileCount,
                               @RequestParam long totalSize,
                               @RequestParam(required = false) String detail) {
        if (!validateServiceApiKey(request)) {
            return Result.error(ResultCode.SERVICE_UNAUTHORIZED.getCode(), "無效的服務 API Key");
        }
        mediaInterfaceService.handleVerifyResult(orderId, success, fileCount, totalSize, detail);
        return Result.ok();
    }

    @PostMapping("/ai-status")
    @Operation(summary = "AI 狀態回報（media→api）", description = "僅限 media 服務以 X-Service-API-Key 呼叫")
    public Result<Void> aiStatus(HttpServletRequest request,
                                 @RequestParam Long orderId,
                                 @RequestParam String status,
                                 @RequestParam(required = false) String detail) {
        if (!validateServiceApiKey(request)) {
            return Result.error(ResultCode.SERVICE_UNAUTHORIZED.getCode(), "無效的服務 API Key");
        }
        mediaInterfaceService.handleAiStatus(orderId, status, detail);
        return Result.ok();
    }

    @PostMapping("/ai-complete")
    @Operation(summary = "AI 調色完成（media→api）", description = "僅限 media 服務以 X-Service-API-Key 呼叫")
    public Result<Void> aiComplete(HttpServletRequest request, @RequestBody AiCompleteRequest body) {
        if (!validateServiceApiKey(request)) {
            return Result.error(ResultCode.SERVICE_UNAUTHORIZED.getCode(), "無效的服務 API Key");
        }
        if (body == null || body.getOrderId() == null
                || body.getAssetUrls() == null || body.getAssetUrls().isEmpty()) {
            return Result.error(ResultCode.BAD_REQUEST.getCode(), "orderId 與 assetUrls 必填");
        }
        mediaInterfaceService.handleAiComplete(body.getOrderId(), body.getAssetUrls());
        return Result.ok();
    }

    @GetMapping("/status/{orderId}")
    @Operation(summary = "媒體處理狀態（給 admin）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> mediaStatus(HttpServletRequest request, @PathVariable Long orderId) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看媒體處理狀態");
        }
        return Result.ok(mediaInterfaceService.getMediaStatus(orderId));
    }

    @PostMapping("/intervene/{orderId}")
    @Operation(summary = "營運介入媒體處理（admin）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> intervene(HttpServletRequest request,
                                  @PathVariable Long orderId,
                                  @RequestParam String reason) {
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限介入媒體處理");
        }
        Long adminUserId = (Long) request.getAttribute("userId");
        mediaInterfaceService.intervene(orderId, reason, adminUserId);
        return Result.ok();
    }

    @PostMapping("/admin/verify/{orderId}/approve")
    @Operation(summary = "RAW 驗收通過（admin）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> adminApproveRaw(HttpServletRequest request,
                                        @PathVariable Long orderId,
                                        @RequestParam(defaultValue = "0") int fileCount,
                                        @RequestParam(defaultValue = "0") long totalSize) {
        authUtil.requireAdmin(request);
        mediaInterfaceService.handleVerifyResult(orderId, true, fileCount, totalSize, "Admin approved");
        return Result.ok();
    }

    @PostMapping("/admin/verify/{orderId}/reject")
    @Operation(summary = "RAW 驗收退回（admin）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> adminRejectRaw(HttpServletRequest request,
                                       @PathVariable Long orderId,
                                       @RequestParam String reason) {
        authUtil.requireAdmin(request);
        mediaInterfaceService.handleVerifyResult(orderId, false, 0, 0, reason);
        return Result.ok();
    }
}