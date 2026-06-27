package com.wanderlens.api.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.mapper.UserMapper;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 使用者管理 API（Admin）
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Admin - Users", description = "使用者帳號管理")
public class AdminUserController {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "使用者列表")
    public Result<List<User>> list(HttpServletRequest request,
                                    @RequestParam(required = false) String keyword) {
        authUtil.requireAdmin(request);
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(User::getEmpno, keyword)
                    .or().like(User::getUsername, keyword)
                    .or().like(User::getPhone, keyword)
                    .or().like(User::getEmail, keyword);
        }
        wrapper.orderByDesc(User::getCreatedAt);
        List<User> users = userMapper.selectList(wrapper);
        // 不回傳密碼
        users.forEach(u -> u.setPassword(null));
        return Result.ok(users);
    }

    @PostMapping
    @Operation(summary = "新增/編輯使用者")
    public Result<User> save(HttpServletRequest request, @RequestBody User body) {
        authUtil.requireAdmin(request);
        if (body.getId() != null) {
            // 編輯
            User existing = userMapper.selectById(body.getId());
            if (existing == null) return Result.error(ResultCode.USER_NOT_FOUND.getCode(), ResultCode.USER_NOT_FOUND.getMessage());
            existing.setUsername(body.getUsername());
            existing.setPhone(body.getPhone());
            existing.setEmail(body.getEmail());
            existing.setRole(body.getRole());
            existing.setArea(body.getArea());
            if (body.getPassword() != null && !body.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(body.getPassword()));
            }
            userMapper.updateById(existing);
            existing.setPassword(null);
            return Result.ok(existing);
        } else {
            // 新增
            if (body.getEmpno() == null || body.getEmpno().isBlank()) {
                return Result.error(ResultCode.BAD_REQUEST.getCode(), "帳號不可為空");
            }
            User existing = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getEmpno, body.getEmpno()));
            if (existing != null) return Result.error(ResultCode.CONFLICT.getCode(), "帳號已存在");
            body.setPassword(passwordEncoder.encode(body.getPassword() != null ? body.getPassword() : "123456"));
            body.setStatus("ACTIVE");
            userMapper.insert(body);
            body.setPassword(null);
            return Result.ok(body);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "刪除使用者")
    public Result<Void> delete(HttpServletRequest request, @PathVariable Long id) {
        authUtil.requireAdmin(request);
        userMapper.deleteById(id);
        return Result.ok(null);
    }
}