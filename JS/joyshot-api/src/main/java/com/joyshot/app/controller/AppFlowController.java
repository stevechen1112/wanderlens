package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.AppFlow;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.mapper.AppFlowMapper;
import com.joyshot.app.service.AppFlowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/appflow")
public class AppFlowController {

    @Autowired
    private AppFlowService service;

    @Autowired
    private AppFlowMapper mapper;


    /**
     * 依分頁撈資料
     *
     * @param pageNum
     * @param pageSize
     * @return
     */
    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           @RequestParam String keyword) {
        IPage<AppFlow> page = new Page<>(pageNum, pageSize);

        IPage<AppFlow> page1 = service.selectPage(page, keyword);

        return Result.success(page1);
    }

    @GetMapping("/type")
    public Result findType(@RequestParam String queryField) {
        QueryWrapper<AppFlow> query = new QueryWrapper<>();
        if (!StrUtil.isBlank(queryField)) {
            query.eq("type", queryField);
        }
        return Result.success(mapper.selectList(query));
    }

    @PostMapping
    public Result save(@RequestBody AppFlow obj) {
        boolean result = service.saveAppFlow(obj);
        return result ? Result.success(obj) : Result.error(Status.CODE_ERROR, "save_failed");
    }
//
//    @DeleteMapping("/{id}")
//    public Result delete(@PathVariable Integer id) {
//        int i = mapper.deleteById(id);
//        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
//    }

    @GetMapping("/groupby")
    public Result findGroupby() {
        List<GroupByDTO> data = mapper.selectGroupByName();
        return Result.success(data);
    }

//    @PostMapping("/limit")
//    public Result findPage(@RequestParam Integer id,
//                           @RequestParam Integer vpThreshold) {
//        mapper.updateVpThreshold(id, vpThreshold);
//        return Result.success(true);
//    }

}
