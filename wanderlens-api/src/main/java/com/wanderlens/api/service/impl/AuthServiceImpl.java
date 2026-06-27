package com.wanderlens.api.service.impl;

import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.entity.dto.LoginRequest;
import com.wanderlens.api.entity.dto.LoginResponse;
import com.wanderlens.api.entity.dto.RegisterRequest;
import com.wanderlens.api.entity.dto.UpdateProfileRequest;
import com.wanderlens.api.entity.enums.UserStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.AuthService;
import com.wanderlens.api.service.UserService;
import com.wanderlens.api.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TOKEN_BLACKLIST_PREFIX = "jwt:blacklist:";
    private static final String LOGIN_ATTEMPT_PREFIX = "login:attempt:";
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final Duration LOGIN_LOCK_DURATION = Duration.ofMinutes(30);
    private static final Duration LOGIN_ATTEMPT_TTL = Duration.ofMinutes(5);

    @Override
    public LoginResponse login(LoginRequest request) {
        // ── 暴力破解防護 ──
        String attemptKey = LOGIN_ATTEMPT_PREFIX + request.getEmpno();
        Object attemptsObj = redisTemplate.opsForValue().get(attemptKey);
        int attempts = attemptsObj != null ? Integer.parseInt(attemptsObj.toString()) : 0;
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            throw new ServiceException(ResultCode.ACCOUNT_DISABLED, "登入失敗次數過多，帳號已暫時鎖定 30 分鐘");
        }

        User user = userService.findByEmpnoWithPassword(request.getEmpno());
        if (user == null) {
            recordFailedAttempt(attemptKey, attempts);
            throw new ServiceException(ResultCode.UNAUTHORIZED, "帳號或密碼錯誤");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            recordFailedAttempt(attemptKey, attempts);
            throw new ServiceException(ResultCode.UNAUTHORIZED, "帳號或密碼錯誤");
        }
        if (UserStatus.SUSPENDED.getCode().equals(user.getStatus())) {
            throw new ServiceException(ResultCode.ACCOUNT_DISABLED);
        }

        // 登入成功：清除失敗計數
        redisTemplate.delete(attemptKey);

        String token = jwtUtil.generateToken(user.getId(), user.getEmpno(), user.getRole());
        log.info("使用者登入: empno={}, role={}", user.getEmpno(), user.getRole());

        return new LoginResponse(
                token,
                user.getId(),
                user.getProviderId(),
                user.getEmpno(),
                user.getUsername(),
                user.getRole(),
                user.getAvatar()
        );
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        if (userService.existsByEmpno(request.getEmpno())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "此帳號已被註冊");
        }

        User user = new User();
        user.setEmpno(request.getEmpno());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setRole("CONSUMER");
        user.setStatus(UserStatus.ACTIVE.getCode());

        User created = userService.createUser(user, request.getPassword());

        String token = jwtUtil.generateToken(created.getId(), created.getEmpno(), created.getRole());
        log.info("使用者註冊: empno={}, role={}", created.getEmpno(), created.getRole());

        return new LoginResponse(
                token,
                created.getId(),
                created.getProviderId(),
                created.getEmpno(),
                created.getUsername(),
                created.getRole(),
                created.getAvatar()
        );
    }

    @Override
    public LoginResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userService.getById(userId);
        if (user == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "使用者不存在");
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        userService.updateById(user);
        log.info("使用者更新個人資料: userId={}", userId);

        return new LoginResponse(
                null,
                user.getId(),
                user.getProviderId(),
                user.getEmpno(),
                user.getUsername(),
                user.getRole(),
                user.getAvatar()
        );
    }

    @Override
    public void logout(Long userId) {
        // 將 token 加入黑名單（TTL 8 小時，與 token 過期時間一致）
        redisTemplate.opsForValue().set(
                TOKEN_BLACKLIST_PREFIX + userId,
                "logout",
                Duration.ofSeconds(28800)
        );
        log.info("使用者登出: userId={}", userId);
    }

    @Override
    public void logoutWithToken(Long userId, String token) {
        // 將具體 token 加入黑名單（TTL 8 小時，與 token 過期時間一致）
        redisTemplate.opsForValue().set(
                TOKEN_BLACKLIST_PREFIX + token,
                "logout",
                Duration.ofSeconds(28800)
        );
        log.info("使用者登出（token 黑名單）: userId={}", userId);
    }

    @Override
    public String refreshToken(Long userId) {
        User user = userService.getById(userId);
        if (user == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "使用者不存在");
        }
        return jwtUtil.generateToken(user.getId(), user.getEmpno(), user.getRole());
    }

    @Override
    public LoginResponse getCurrentUser(Long userId) {
        User user = userService.getById(userId);
        if (user == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "使用者不存在");
        }
        return new LoginResponse(
                null,
                user.getId(),
                user.getProviderId(),
                user.getEmpno(),
                user.getUsername(),
                user.getRole(),
                user.getAvatar()
        );
    }

    /**
     * 記錄登入失敗嘗試
     */
    private void recordFailedAttempt(String attemptKey, int currentAttempts) {
        int newAttempts = currentAttempts + 1;
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            // 達到上限：鎖定 30 分鐘
            redisTemplate.opsForValue().set(attemptKey, String.valueOf(newAttempts), LOGIN_LOCK_DURATION);
            log.warn("帳號已鎖定: key={}, attempts={}", attemptKey, newAttempts);
        } else {
            redisTemplate.opsForValue().set(attemptKey, String.valueOf(newAttempts), LOGIN_ATTEMPT_TTL);
        }
    }
}