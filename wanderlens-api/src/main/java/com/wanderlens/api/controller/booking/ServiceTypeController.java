package com.wanderlens.api.controller.booking;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.ServiceType;
import com.wanderlens.api.service.ServiceTypeService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 拍攝類型 API 別名（相容 API_SPEC /admin 路徑）
 */
@RestController
@RequestMapping("/service-types")
@RequiredArgsConstructor
@Tag(name = "ServiceType", description = "拍攝類型")
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "拍攝類型列表")
    public Result<List<ServiceType>> list() {
        return Result.ok(serviceTypeService.listActive());
    }

    @GetMapping("/{id}/suggested-config")
    @Operation(summary = "類型建議配置")
    public Result<String> suggestedConfig(@PathVariable Long id) {
        return Result.ok(serviceTypeService.getSuggestedConfig(id));
    }

    @PostMapping
    @Operation(summary = "新增/編輯拍攝類型")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<ServiceType> save(HttpServletRequest request, @RequestBody ServiceType body) {
        authUtil.requireAdmin(request);
        if (body.getId() != null) {
            serviceTypeService.updateById(body);
        } else {
            serviceTypeService.save(body);
        }
        return Result.ok(body);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除拍攝類型")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        serviceTypeService.removeById(id);
        return Result.ok(null);
    }
}
