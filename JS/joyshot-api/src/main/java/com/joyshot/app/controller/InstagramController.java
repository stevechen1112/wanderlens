package com.joyshot.app.controller;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Faq;
import com.joyshot.app.entity.InstagramPost;
import com.joyshot.app.entity.News;
import com.joyshot.app.mapper.InstagramPostMapper;
import com.joyshot.app.mapper.NewsMapper;
import com.joyshot.app.service.InstagramPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/instagram")
public class InstagramController extends AppBaseController {


    @Autowired
    private InstagramPostMapper instagramPostMapper;

    @Autowired
    private InstagramPostService instagramPostService;


    @GetMapping()
    public Result getAll() {
        QueryWrapper<InstagramPost> query = new QueryWrapper<>();
        List<InstagramPost> list = instagramPostMapper.selectList(query);
        return (list != null) ? Result.success(list) : Result.error(Status.CODE_ERROR, "get_instagram_failed");
    }

    @PostMapping
    public Result save(@RequestBody InstagramPost post) {
        boolean result = instagramPostService.saveOrUpdate(post);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = instagramPostService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }



}
