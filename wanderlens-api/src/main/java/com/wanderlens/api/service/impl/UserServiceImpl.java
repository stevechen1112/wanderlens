package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.User;
import com.wanderlens.api.entity.enums.UserStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.UserMapper;
import com.wanderlens.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;

    @Override
    public User findByEmpno(String empno) {
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmpno, empno)
                .ne(User::getStatus, UserStatus.DELETED.getCode()));
    }

    @Override
    public User findByEmpnoWithPassword(String empno) {
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getEmpno, empno)
                .ne(User::getStatus, UserStatus.DELETED.getCode()));
    }

    @Override
    public boolean existsByEmpno(String empno) {
        return count(new LambdaQueryWrapper<User>()
                .eq(User::getEmpno, empno)
                .ne(User::getStatus, UserStatus.DELETED.getCode())) > 0;
    }

    @Override
    public User createUser(User user, String rawPassword) {
        if (existsByEmpno(user.getEmpno())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "帳號已存在");
        }
        user.setPassword(passwordEncoder.encode(rawPassword));
        if (user.getStatus() == null) {
            user.setStatus(UserStatus.ACTIVE.getCode());
        }
        save(user);
        return user;
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getById(userId);
        if (user == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "使用者不存在");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "舊密碼不正確");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        updateById(user);
    }
}