package com.wanderlens.api.controller.auth;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.dto.ChangePasswordRequest;
import com.wanderlens.api.entity.dto.LoginRequest;
import com.wanderlens.api.entity.dto.LoginResponse;
import com.wanderlens.api.entity.dto.RegisterRequest;
import com.wanderlens.api.entity.dto.UpdateProfileRequest;
import com.wanderlens.api.service.AuthService;
import com.wanderlens.api.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 認證 API
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "認證")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    @Operation(summary = "登入", description = "帳號 + 密碼 → JWT token")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "註冊", description = "消費者自助註冊 → 直接回傳 JWT token")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        return Result.ok(authService.register(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "登出", description = "將 token 加入黑名單，立即失效")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> logout(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // 將 token 加入 Redis 黑名單
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logoutWithToken(userId, token);
        } else {
            authService.logout(userId);
        }
        return Result.ok();
    }

    @PostMapping("/refresh")
    @Operation(summary = "刷新 token")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> refreshToken(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(authService.refreshToken(userId));
    }

    @GetMapping("/me")
    @Operation(summary = "取得當前使用者")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<LoginResponse> me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(authService.getCurrentUser(userId));
    }

    @PutMapping("/me")
    @Operation(summary = "更新當前使用者個人資料")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<LoginResponse> updateMe(HttpServletRequest request,
                                          @Valid @RequestBody UpdateProfileRequest body) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(authService.updateProfile(userId, body));
    }

    @PostMapping("/change-password")
    @Operation(summary = "變更密碼")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> changePassword(HttpServletRequest request,
                                        @Valid @RequestBody ChangePasswordRequest body) {
        if (!body.getNewPassword().equals(body.getConfirmPassword())) {
            return Result.error(ResultCode.BAD_REQUEST.getCode(), "新密碼與確認密碼不一致");
        }
        Long userId = (Long) request.getAttribute("userId");
        userService.changePassword(userId, body.getOldPassword(), body.getNewPassword());
        return Result.ok();
    }

    @GetMapping("/account/exists")
    @Operation(summary = "檢查帳號是否已存在")
    public Result<Boolean> accountExists(@RequestParam String empno) {
        return Result.ok(userService.existsByEmpno(empno));
    }
}