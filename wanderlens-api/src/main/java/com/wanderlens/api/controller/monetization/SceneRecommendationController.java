package com.wanderlens.api.controller.monetization;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.SceneRecommendation;
import com.wanderlens.api.service.SceneRecommendationService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scene-recommendations")
@RequiredArgsConstructor
@Tag(name = "Monetization", description = "場景推薦與變現")
public class SceneRecommendationController {

    private final SceneRecommendationService sceneRecommendationService;
    private final AuthUtil authUtil;

    @GetMapping("/context")
    @Operation(summary = "依訂單/拍攝場景取得推薦（消費者）")
    public Result<List<SceneRecommendation>> byContext(
            @RequestParam(required = false) Long serviceTypeId,
            @RequestParam(required = false) String sceneTag) {
        return Result.ok(sceneRecommendationService.getByOrderContext(serviceTypeId, sceneTag));
    }

    @GetMapping
    @Operation(summary = "全部有效推薦（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<SceneRecommendation>> list(HttpServletRequest request) {
        authUtil.requireAdmin(request);
        return Result.ok(sceneRecommendationService.listActive());
    }

    @PostMapping
    @Operation(summary = "新增/更新場景推薦")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<SceneRecommendation> save(HttpServletRequest request, @RequestBody SceneRecommendation body) {
        authUtil.requireAdmin(request);
        return Result.ok(sceneRecommendationService.saveRecommendation(body));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        sceneRecommendationService.removeById(id);
        return Result.ok();
    }
}
