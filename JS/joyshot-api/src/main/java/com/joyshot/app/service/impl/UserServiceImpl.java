package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.common.AppConstant;
import com.joyshot.app.controller.dto.UserPasswordChangeDTO;
import com.joyshot.app.entity.*;
import com.joyshot.app.mapper.ActionLogMapper;
import com.joyshot.app.mapper.RoleMenuMapper;
import com.joyshot.app.mapper.UserMapper;
import com.joyshot.app.service.MenuService;
import com.joyshot.app.service.UserService;
import com.joyshot.app.util.MD5Util;
import com.joyshot.app.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author avery
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements UserService {

    @Autowired
    UserMapper userMapper;

    @Autowired
    private MenuService menuService;

    @Autowired
    private RoleMenuMapper roleMenuMapper;


    @Autowired
    private ActionLogMapper actionLogMapper;


    @Override
    public IPage<User> page(IPage<User> page, String queryField, String keyword) {
        return userMapper.findPage(page, queryField, keyword);
    }

    @Override
    public User doLogin(User user) {
        String pass = MD5Util.encodedPassword(user.getPassword());
        user.setPassword(pass);
        User userFound = userMapper.login(user);
        if (userFound != null) {
            String token = TokenUtil.generateToken(user.getEmpno(), user.getPassword());
            userFound.setToken(token);
            //save token to user
            saveOrUpdate(userFound);

            List<Menu> roleMenus = getUserRoleMenu(userFound.getRoleId());
            userFound.setUserMenus(roleMenus);

            //save login history
            ActionLog log = new ActionLog();
            log.setAction(AppConstant.ACTION_LOGIN);
            log.setUserId(userFound.getId());
            actionLogMapper.insert(log);

            return userFound;
        }

        return null;
    }

    @Override
    public void doLogout(User execUser) {
        execUser.setToken("");
        saveOrUpdate(execUser);
        ActionLog log = new ActionLog();
        log.setAction(AppConstant.ACTION_LOGOUT);
        log.setUserId(execUser.getId());
        actionLogMapper.insert(log);
    }

    /**
     * 取得角色所擁有的選單
     *
     * @param roleId
     * @return
     */
    private List<Menu> getUserRoleMenu(Integer roleId) {
        //屬於這個角色的選單
        List<Integer> menuIds = roleMenuMapper.selectByRoleId(roleId);

        //所有的選單
        List<Menu> allMenus = menuService.findAll("");

        List<Menu> roleMenus = new ArrayList<>();
        //再比對角色裡的選單，若不存在，則從所有的選單資料裡移除
        for (Menu menu : allMenus) {
            //先處理 root node
            if (menuIds.contains(menu.getId())) {
                roleMenus.add(menu);
            }

            List<Menu> childrenMenus = menu.getChildren();
            childrenMenus.removeIf(child -> !menuIds.contains(child.getId()));
        }
        return roleMenus;
    }

    @Override
    public User login(User user) {
        return userMapper.login(user);
    }

    @Override
    public boolean changePassword(UserPasswordChangeDTO dto) {
        User user = this.getById(dto.getId());
        String oldPassword = MD5Util.encodedPassword(dto.getOldPassword());
        if (!user.getPassword().equals(oldPassword)) {
            return false;
        }

        user.setPassword(MD5Util.encodedPassword(dto.getNewPassword()));
        boolean save = this.saveOrUpdate(user);
        return save;
    }

    @Override
    public boolean updateOrCreateUser(Photographer p) {
        int i = userMapper.updateByPhId(p.getNickName(), p.getId());
        System.out.println("update user:" + i);
        //User user = userMapper.selectByPhId(p.getId());
        if (i == 1) {
            System.out.println("photographer account exist. no action");
            return true;
        } else {
            System.out.println("Create new login photographer");
            String md5Password = MD5Util.encodedPassword(p.getPhone());
            int update = userMapper.addPhotographerAccount(p.getPhone(), p.getNickName(), md5Password, p.getId());
            return update > 0;
        }
    }

    @Override
    public void removePhotographer(Integer id) {
        userMapper.removePhotographer(id);

    }

    @Override
    public void removeAffiliate(Integer id) {
        userMapper.removeAffiliate(id);
    }

    @Override
    public boolean updateOrCreateAffiliateUser(Affiliate affiliate, Role role) {
        int i = userMapper.updateByAffId(affiliate.getNickName(), affiliate.getId());
        if (i == 1) {
            System.out.println("affiliate account exist. no action");
            return true;
        } else {
            System.out.println("Create new login affiliate");
            String md5Password = MD5Util.encodedPassword(affiliate.getPhone());
            int update = userMapper.addAffiliateAccount(affiliate.getPhone(), affiliate.getNickName(), md5Password, affiliate.getId(), role.getId());
            return update > 0;
        }
    }
}




