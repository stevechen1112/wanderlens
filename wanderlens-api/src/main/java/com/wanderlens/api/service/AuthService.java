package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.LoginRequest;
import com.wanderlens.api.entity.dto.LoginResponse;
import com.wanderlens.api.entity.dto.RegisterRequest;
import com.wanderlens.api.entity.dto.UpdateProfileRequest;

public interface AuthService {

    /**
     * 登入
     */
    LoginResponse login(LoginRequest request);

    /**
     * 註冊（消費者自助註冊，成功後直接回傳含 token 的登入資訊）
     */
    LoginResponse register(RegisterRequest request);

    /**
     * 更新當前使用者個人資料
     */
    LoginResponse updateProfile(Long userId, UpdateProfileRequest request);

    /**
     * 登出
     */
    void logout(Long userId);

    /**
     * 登出並將 token 加入黑名單（立即失效）
     */
    void logoutWithToken(Long userId, String token);

    /**
     * 刷新 token
     */
    String refreshToken(Long userId);

    /**
     * 取得當前使用者資訊
     */
    LoginResponse getCurrentUser(Long userId);
}