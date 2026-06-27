package com.joyshot.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.*;
import com.joyshot.app.mapper.NewsMapper;
import com.joyshot.app.mapper.PhotographerFeatureMapper;
import com.joyshot.app.mapper.PhotographerMapper;
import com.joyshot.app.service.NewsService;
import com.joyshot.app.service.PhotographerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/news")
public class NewsController extends AppBaseController {

    @Autowired
    private NewsMapper newsMapper;

    @Autowired
    private NewsService newsService;

    @GetMapping("/on")
    public Result get(@RequestParam(required=false) String lang) {
        QueryWrapper<News> query = new QueryWrapper<>();
        query.eq("status", "on");
        if (lang != null) {
            query.eq("language", lang);
        }
        List<News> list = newsMapper.selectList(query);
        return (list != null ) ? Result.success(list) : Result.error(Status.CODE_ERROR, "get_news_failed");
    }

    @GetMapping()
    public Result getAll() {
        QueryWrapper<News> query = new QueryWrapper<>();
        List<News> list = newsMapper.selectList(query);
        return (list != null) ? Result.success(list) : Result.error(Status.CODE_ERROR, "get_news_failed");
    }

    @PostMapping()
    public Result updatStatus(@RequestBody News news) {
        boolean result = newsService.saveOrUpdate(news);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = newsMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

}
