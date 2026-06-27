package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.Menu;
import com.wanderlens.api.entity.Role;
import com.wanderlens.api.entity.RoleMenu;
import com.wanderlens.api.mapper.MenuMapper;
import com.wanderlens.api.mapper.RoleMapper;
import com.wanderlens.api.mapper.RoleMenuMapper;
import com.wanderlens.api.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements RoleService {

    private final MenuMapper menuMapper;
    private final RoleMenuMapper roleMenuMapper;

    @Override
    public List<Menu> getMenusByRoleId(Long roleId) {
        return menuMapper.selectByRoleId(roleId);
    }

    @Override
    @Transactional
    public void assignMenus(Long roleId, List<Long> menuIds) {
        // 先刪除舊關聯
        roleMenuMapper.deleteByRoleId(roleId);

        // 再建立新關聯
        if (menuIds != null && !menuIds.isEmpty()) {
            List<RoleMenu> roleMenus = menuIds.stream().map(menuId -> {
                RoleMenu rm = new RoleMenu();
                rm.setRoleId(roleId);
                rm.setMenuId(menuId);
                return rm;
            }).collect(Collectors.toList());

            for (RoleMenu rm : roleMenus) {
                roleMenuMapper.insert(rm);
            }
        }
    }
}