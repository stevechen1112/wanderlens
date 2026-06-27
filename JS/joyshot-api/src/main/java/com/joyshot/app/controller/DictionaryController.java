package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Dict;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.mapper.DictMapper;
import com.joyshot.app.service.DictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/dic")
public class DictionaryController {

    @Autowired
    private DictService service;

    @Autowired
    private DictMapper mapper;

    @GetMapping("/groupby")
    public Result findGroupby() {
        List<GroupByDTO> data = mapper.selectGroupByType();
        return Result.success(data);
    }

    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           @RequestParam String queryField,
                           @RequestParam String keyword) {
        IPage<Dict> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Dict> query = new QueryWrapper<>();
        query.eq("visible", "Y");
        if (!StrUtil.isBlank(queryField)) {
            query.eq("type", queryField);
            query.like("name", keyword);
        }
        query.orderByDesc("id");
        IPage<Dict> page1 = service.page(page, query);

        return Result.success(page1);
    }

    @GetMapping("/type")
    public Result findType(@RequestParam String queryField) {
        QueryWrapper<Dict> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(queryField)) {
            query.eq("type", queryField);
        }
        query.orderByDesc("value");
        return Result.success(mapper.selectList(query));
    }

    @PostMapping
    public Result save(@RequestBody Dict obj) {
        boolean result = service.saveOrUpdate(obj);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = mapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

}
