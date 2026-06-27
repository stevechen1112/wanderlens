package com.wanderlens.api.service;

import com.wanderlens.api.entity.User;
import com.wanderlens.api.entity.dto.LoginResponse;
import com.wanderlens.api.entity.dto.RegisterRequest;
import com.wanderlens.api.entity.dto.UpdateProfileRequest;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.service.impl.AuthServiceImpl;
import com.wanderlens.api.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 認證服務單元測試：涵蓋註冊與個人資料更新（Mockito，不依賴資料庫）。
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserService userService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_success_returnsTokenAndConsumerRole() {
        RegisterRequest req = new RegisterRequest();
        req.setEmpno("0912345678");
        req.setUsername("王小明");
        req.setPhone("0912345678");
        req.setEmail("ming@example.com");
        req.setPassword("pw123456");

        when(userService.existsByEmpno("0912345678")).thenReturn(false);
        User created = new User();
        created.setId(10L);
        created.setEmpno("0912345678");
        created.setUsername("王小明");
        created.setRole("CONSUMER");
        when(userService.createUser(any(User.class), eq("pw123456"))).thenReturn(created);
        when(jwtUtil.generateToken(10L, "0912345678", "CONSUMER")).thenReturn("tok-abc");

        LoginResponse resp = authService.register(req);

        assertEquals("tok-abc", resp.getToken());
        assertEquals(10L, resp.getUserId());
        assertEquals("CONSUMER", resp.getRole());
        verify(userService).createUser(any(User.class), eq("pw123456"));
    }

    @Test
    void register_duplicateEmpno_throws() {
        RegisterRequest req = new RegisterRequest();
        req.setEmpno("0912345678");
        req.setUsername("王小明");
        req.setPassword("pw123456");

        when(userService.existsByEmpno("0912345678")).thenReturn(true);

        assertThrows(ServiceException.class, () -> authService.register(req));
        verify(userService, never()).createUser(any(), any());
    }

    @Test
    void updateProfile_updatesAllowedFields() {
        User existing = new User();
        existing.setId(5L);
        existing.setEmpno("0911111111");
        existing.setUsername("舊名字");
        existing.setRole("CONSUMER");
        when(userService.getById(5L)).thenReturn(existing);

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setUsername("新名字");
        req.setPhone("0922222222");
        req.setEmail("new@example.com");
        req.setAvatar("https://cdn/a.png");

        LoginResponse resp = authService.updateProfile(5L, req);

        assertEquals("新名字", existing.getUsername());
        assertEquals("0922222222", existing.getPhone());
        assertEquals("new@example.com", existing.getEmail());
        assertEquals("https://cdn/a.png", existing.getAvatar());
        assertEquals("新名字", resp.getUsername());
        assertNull(resp.getToken());
        verify(userService).updateById(existing);
    }

    @Test
    void updateProfile_userNotFound_throws() {
        when(userService.getById(99L)).thenReturn(null);
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setUsername("x");

        assertThrows(ServiceException.class, () -> authService.updateProfile(99L, req));
        verify(userService, never()).updateById(any());
    }
}
