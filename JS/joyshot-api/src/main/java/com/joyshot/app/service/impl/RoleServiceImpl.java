package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Role;
import com.joyshot.app.entity.RoleMenu;
import com.joyshot.app.mapper.RoleMapper;
import com.joyshot.app.mapper.RoleMenuMapper;
import com.joyshot.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author avery
 */
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role>
        implements RoleService {

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Transactional(rollbackFor = {SecurityException.class})
    @Override
    public void setRoleMenu(Integer roleId, List<Integer> menuIds) {
        //delete all first
        int i = roleMenuMapper.deleteByRoleId(roleId);

        //then save
        for (Integer menuId : menuIds) {
            RoleMenu roleMenu = new RoleMenu();
            roleMenu.setRoleId(roleId);
            roleMenu.setMenuId(menuId);
            roleMenuMapper.insert(roleMenu);
        }
    }

    @Override
    public List<Integer> getRoleMenu(Integer roleId) {
        return roleMenuMapper.selectByRoleId(roleId);
    }
}




