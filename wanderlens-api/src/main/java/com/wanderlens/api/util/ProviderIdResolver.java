package com.wanderlens.api.util;

import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * 將登入使用者 ID 解析為 provider 表主鍵。
 * 攝影師帳號的 user.id 與 provider.id 可能不同（user.provider_id 關聯）。
 */
@Component
@RequiredArgsConstructor
public class ProviderIdResolver {

    private final UserMapper userMapper;

    public Long resolve(Long userId) {
        if (userId == null) {
            throw new ServiceException(ResultCode.UNAUTHORIZED);
        }
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new ServiceException(ResultCode.UNAUTHORIZED);
        }
        if (user.getProviderId() != null) {
            return user.getProviderId();
        }
        return userId;
    }

    public Long resolve(HttpServletRequest request) {
        return resolve((Long) request.getAttribute("userId"));
    }
}
