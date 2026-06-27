package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.AppConstant;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Dict;
import com.joyshot.app.entity.Menu;
import com.joyshot.app.mapper.DictMapper;
import com.joyshot.app.mapper.MenuMapper;
import com.joyshot.app.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private MenuMapper menuMapper;

    @Autowired
    private DictMapper dictionaryMapper;


    @GetMapping
    public Result findAll(@RequestParam String keyword) {
        List<Menu> menuNodes = menuService.findAll(keyword);
        return Result.success(menuNodes);
    }


    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           @RequestParam String keyword) {
        IPage<Menu> page = new Page<>(pageNum, pageSize);
        QueryWrapper<Menu> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(keyword)) {
            query.like("name", keyword);
        }
        return Result.success(menuService.page(page, query));
    }

    @PostMapping
    public Result save(@RequestBody Menu menu) {
        boolean result = menuService.saveOrUpdate(menu);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = menuMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @GetMapping("/icons")
    public Result getIcons() {
        QueryWrapper<Dict> query = new QueryWrapper<>();
        query.eq("type", AppConstant.DIC_TYPE_ICON);
        return Result.success(dictionaryMapper.selectList(query));
    }

}
