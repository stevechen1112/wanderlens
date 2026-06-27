package com.wanderlens.api.controller.admin;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Menu;
import com.wanderlens.api.mapper.MenuMapper;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 選單管理 API（Admin）
 */
@RestController
@RequestMapping("/menus")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin - Menus", description = "選單管理")
public class AdminMenuController {

    private final MenuMapper menuMapper;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "選單列表")
    public Result<List<Menu>> list(HttpServletRequest request) {
        authUtil.requireAdmin(request);
        return Result.ok(menuMapper.selectList(null));
    }

    @PostMapping
    @Operation(summary = "新增/編輯選單")
    public Result<Menu> save(HttpServletRequest request, @RequestBody Menu body) {
        authUtil.requireAdmin(request);
        if (body.getId() != null) {
            menuMapper.updateById(body);
        } else {
            menuMapper.insert(body);
        }
        return Result.ok(body);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除選單")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        menuMapper.deleteById(id);
        return Result.ok(null);
    }
}