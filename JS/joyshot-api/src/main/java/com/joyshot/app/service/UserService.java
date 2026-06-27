package com.joyshot.app.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.joyshot.app.controller.dto.UserPasswordChangeDTO;
import com.joyshot.app.entity.Affiliate;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.entity.Role;
import com.joyshot.app.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.stereotype.Service;

/**
 * @author avery
 * @createDate 2022-04-29 21:37:06
 */
@Service
public interface UserService extends IService<User> {

    User login(User user);

    IPage<User> page(IPage<User> page, String queryField, String keyword);

    User doLogin(User user);

    void doLogout(User execUser);

    boolean changePassword(UserPasswordChangeDTO dto);

    boolean updateOrCreateUser(Photographer photographer);

    boolean updateOrCreateAffiliateUser(Affiliate affiliate, Role role);

    void removePhotographer(Integer id);

    void removeAffiliate(Integer id);
}
