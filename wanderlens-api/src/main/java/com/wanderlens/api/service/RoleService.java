package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Menu;
import com.wanderlens.api.entity.Role;

import java.util.List;

public interface RoleService extends IService<Role> {

    /**
     * 依角色 ID 取得選單列表
     */
    List<Menu> getMenusByRoleId(Long roleId);

    /**
     * 設定角色的選單權限
     */
    void assignMenus(Long roleId, List<Long> menuIds);
}