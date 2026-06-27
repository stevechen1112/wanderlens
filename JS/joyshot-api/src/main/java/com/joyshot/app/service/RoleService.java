package com.joyshot.app.service;

import com.joyshot.app.entity.Role;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
 * @author avery
 */
public interface RoleService extends IService<Role> {

    void setRoleMenu(Integer roleId, List<Integer> menuIds);

    List<Integer> getRoleMenu(Integer roleId);
}
