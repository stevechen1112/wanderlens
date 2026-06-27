package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Role;
import com.joyshot.app.mapper.MenuMapper;
import com.joyshot.app.mapper.RoleMapper;
import com.joyshot.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/role")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private MenuMapper menuMapper;


    @GetMapping
    public Result findAll() {
        return Result.success(roleMapper.selectList(null));
    }

    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           @RequestParam String queryField,
                           @RequestParam String keyword) {
        IPage<Role> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Role> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(queryField)) {
            query.like(queryField, keyword);
        }
        return Result.success(roleService.page(page, query));
    }

    @PostMapping
    public Result save(@RequestBody Role role) {
        boolean result = roleService.saveOrUpdate(role);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = roleMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }


    /**
     * 設定角色與選單的關聯
     *
     * @param roleId
     * @param menuIds
     * @return
     */
    @PostMapping("/menu/{roleId}")
    public Result roleMenu(@PathVariable Integer roleId, @RequestBody List<Integer> menuIds) {
        roleService.setRoleMenu(roleId, menuIds);
        return Result.success();
    }

    /**
     * 取得角色的選單
     *
     * @param roleId
     * @return
     */
    @GetMapping("/menu/{roleId}")
    public Result getRoleMenu(@PathVariable Integer roleId) {
        List<Integer> roleMenu = roleService.getRoleMenu(roleId);
        return Result.success(roleMenu);
    }

    /**
     * 取得所有的選單
     *
     * @return
     */
    @GetMapping("/allmenu")
    public Result allMenu() {
        List<Integer> menus = menuMapper.selectAllMenuId();
        return Result.success(menus);
    }

}
