package com.wanderlens.api.controller.admin;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.Role;
import com.wanderlens.api.mapper.RoleMapper;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理 API（Admin）
 */
@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin - Roles", description = "角色管理")
public class AdminRoleController {

    private final RoleMapper roleMapper;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "角色列表")
    public Result<List<Role>> list(HttpServletRequest request) {
        authUtil.requireAdmin(request);
        return Result.ok(roleMapper.selectList(null));
    }

    @PostMapping
    @Operation(summary = "新增/編輯角色")
    public Result<Role> save(HttpServletRequest request, @RequestBody Role body) {
        authUtil.requireAdmin(request);
        if (body.getId() != null) {
            roleMapper.updateById(body);
        } else {
            roleMapper.insert(body);
        }
        return Result.ok(body);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除角色")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        roleMapper.deleteById(id);
        return Result.ok(null);
    }
}