package com.joyshot.app.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.Area;
import com.joyshot.app.mapper.AreaMapper;
import com.joyshot.app.service.AreaService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * @author avery
 */
@Service
public class AreaServiceImpl extends ServiceImpl<AreaMapper, Area>
        implements AreaService {

    @Override
    public List<Area> findAll(String keyword) {
        //先找到所有選單
        QueryWrapper<Area> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(keyword)) {
            query.like("name", keyword);
        }
        List<Area> list = list(query);

        //從所有選單找出第一階選單(parent_id=null)
        List<Area> parentNodes = list.stream().filter(area -> area.getParentId() == null).collect(Collectors.toList());
        for (Area area : parentNodes) {
            //找出第一階選單的子選單
            List<Area> children = list.stream().filter(m -> area.getId().equals(m.getParentId())).collect(Collectors.toList());
            area.setChildren(children);

            for (Area child : children) {
                List<Area> grandChild = list.stream().filter(m -> child.getId().equals(m.getParentId())).collect(Collectors.toList());
                child.setChildren(grandChild);
            }

        }
        return parentNodes;
    }
}




