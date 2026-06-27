package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.User;

public interface UserService extends IService<User> {

    /**
     * 依帳號查詢使用者
     */
    User findByEmpno(String empno);

    /**
     * 依帳號查詢使用者（含密碼，僅登入用）
     */
    User findByEmpnoWithPassword(String empno);

    /**
     * 檢查帳號是否已存在
     */
    boolean existsByEmpno(String empno);

    /**
     * 建立使用者（密碼 BCrypt 加密）
     */
    User createUser(User user, String rawPassword);

    /**
     * 變更密碼
     */
    void changePassword(Long userId, String oldPassword, String newPassword);
}