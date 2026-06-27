package com.wanderlens.api.controller.recall;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.dto.RecallItemDto;
import com.wanderlens.api.service.RecallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recall")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Recall", description = "推播召回與回憶牆")
public class RecallController {

    private final RecallService recallService;

    @GetMapping("/feed")
    @Operation(summary = "取得召回回憶牆（週年/寶寶月份/旅遊回顧）")
    public Result<List<RecallItemDto>> feed(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(recallService.getFeed(userId));
    }
}
