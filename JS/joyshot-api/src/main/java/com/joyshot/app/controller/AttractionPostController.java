package com.joyshot.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.AttractionPost;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.entity.InstagramPost;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.mapper.AttractionPostMapper;
import com.joyshot.app.mapper.InstagramPostMapper;
import com.joyshot.app.service.AttractionPostService;
import com.joyshot.app.service.InstagramPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/attraction")
public class AttractionPostController extends AppBaseController {

    @Autowired
    private AttractionPostMapper attractionPostMapper;

    @Autowired
    private AttractionPostService attractionPostService;

    @GetMapping()
    public Result getAll(@RequestParam Integer pageNum,
                         @RequestParam Integer pageSize,
                         @RequestParam(required=false) String lang,
                         @RequestParam Integer areaId) {
        IPage<AttractionPost> page = new Page<>(pageNum, pageSize);
        Page<AttractionPost> list = attractionPostMapper.selectByPage(page, areaId, lang);
        return (list != null) ? Result.success(list) : Result.error(Status.CODE_ERROR, "get_attraction_post_failed");
    }

    @PostMapping
    public Result save(@RequestBody AttractionPost post) {
        boolean result = attractionPostService.saveOrUpdate(post);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = attractionPostService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @GetMapping("/groupby")
    public Result getAreaGroup() {
        List<GroupByDTO> data = attractionPostMapper.selectGroupByType();
        return Result.success(data);
    }

}
