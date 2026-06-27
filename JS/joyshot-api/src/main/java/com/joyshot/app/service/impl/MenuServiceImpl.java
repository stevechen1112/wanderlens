package com.joyshot.app.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Menu;
import com.joyshot.app.mapper.MenuMapper;
import com.joyshot.app.service.MenuService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author avery
 */
@Service
public class MenuServiceImpl extends ServiceImpl<MenuMapper, Menu>
        implements MenuService {


    @Override
    public List<Menu> findAll(String keyword) {
        //先找到所有選單
        QueryWrapper<Menu> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(keyword)) {
            query.like("name", keyword);
        }
        List<Menu> list = list(query);

        //從所有選單找出第一階選單(parent_id=null)
        List<Menu> parentNodes = list.stream().filter(menu -> menu.getParentId() == null).collect(Collectors.toList());
        for (Menu menu : parentNodes) {
            //找出第一階選單的子選單
            List<Menu> children = list.stream().filter(m -> menu.getId().equals(m.getParentId())).collect(Collectors.toList());
            menu.setChildren(children);
        }
        return parentNodes;
    }
}




