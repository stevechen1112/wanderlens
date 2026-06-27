package com.joyshot.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Banner;
import com.joyshot.app.entity.InstagramPost;
import com.joyshot.app.mapper.BannerMapper;
import com.joyshot.app.mapper.InstagramPostMapper;
import com.joyshot.app.service.BannerService;
import com.joyshot.app.service.InstagramPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/banner")
public class BannerController extends AppBaseController {

    @Autowired
    private BannerMapper bannerMapper;

    @Autowired
    private BannerService bannerService;

    @GetMapping()
    public Result getAll() {
        QueryWrapper<Banner> query = new QueryWrapper<>();
        query.orderByAsc("image_usage");
        List<Banner> list = bannerMapper.selectList(query);
        return (list != null) ? Result.success(list) : Result.error(Status.CODE_ERROR, "get_banner_failed");
    }

    @GetMapping("/type/{imageUsage}")
    public Result getBanner(@PathVariable String imageUsage, @RequestParam(required=false) String lang) {
        List<Banner> banners = bannerMapper.findByType(imageUsage, lang);
        return (banners != null) ? Result.success(banners) : Result.error(Status.CODE_ERROR, "get_banner_failed");
    }

    @PostMapping
    public Result save(@RequestBody Banner post) {
        boolean result = bannerService.saveOrUpdate(post);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @PostMapping("/live")
    public Result setActiveState(@RequestBody Banner banner) {
        boolean result = bannerMapper.saveActiveStatus(banner.getId(), banner.getActive());
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = bannerService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

}
