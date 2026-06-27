package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.mapper.AreaMapper;
import com.joyshot.app.mapper.PhotographerMapper;
import com.joyshot.app.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/area")
public class AreaController {

    @Autowired
    private AreaService areaService;

    @Autowired
    private AreaMapper areaMapper;

    @Autowired
    private PhotographerMapper photographerMapper;


    @GetMapping
    public Result findAll(@RequestParam String keyword) {
        List<Area> menuNodes = areaService.findAll(keyword);
        return Result.success(menuNodes);
    }

    @PostMapping
    public Result save(@RequestBody Area role) {
        boolean result = areaService.saveOrUpdate(role);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = areaMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    /**
     * 縣市
     * @param request
     * @return
     */
    @GetMapping("/area1")
    public Result findArea1(HttpServletRequest request) {
        QueryWrapper<Area> query = new QueryWrapper<>();
        query.isNull("parent_id");
        return Result.success(areaMapper.selectList(query));
    }

    /**
     * 鄉鎮區
     * @param area1
     * @return
     */
    @GetMapping("/area2/{area1}")
    public Result findArea2(@PathVariable Integer area1) {
        QueryWrapper<Area> query = new QueryWrapper<>();
        query.eq("parent_id", area1);
        return Result.success(areaMapper.selectList(query));
    }

    @GetMapping("/area2/all")
    public Result findAllArea2() {
        ArrayList<Integer> parent = new ArrayList<Integer>();
        parent.add(1);
        parent.add(2);
        parent.add(3);
        parent.add(375);
        parent.add(376);
        QueryWrapper<Area> query = new QueryWrapper<>();
        query.in("parent_id",parent);
        List<Area> areas = areaMapper.selectList(query);
        System.out.println(areas);
        return Result.success(areas);
    }

    @GetMapping("/area3/{area2}")
    public Result findArea3(@PathVariable Integer area2) {
        QueryWrapper<Area> query = new QueryWrapper<>();
        query.eq("parent_id", area2);
        return Result.success(areaMapper.selectList(query));
    }

    @GetMapping("/min-hour")
    public Result findMinHour(@RequestParam String city, @RequestParam String district) {
        Area parentArea = areaMapper.getParentByName(city);
        QueryWrapper<Area> query1 = new QueryWrapper<>();
        query1.eq("parent_id", parentArea.getId());
        query1.eq("name", district);
        Area child = areaMapper.selectList(query1).get(0);

        return child != null ? Result.success(child.getMinHour()) : Result.error(Status.CODE_ERROR, "get_min_hour_failed");
    }


}
