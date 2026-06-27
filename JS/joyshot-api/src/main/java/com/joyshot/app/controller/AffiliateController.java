package com.joyshot.app.controller;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Affiliate;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.mapper.AffiliateMapper;
import com.joyshot.app.service.AffiliateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/affiliate")
public class AffiliateController extends AppBaseController {

    @Autowired
    private AffiliateMapper affiliateMapper;

    @Autowired
    private AffiliateService affiliateService;


    @GetMapping("/all")
    public Result selectByPage(@RequestParam Integer pageNum,
                            @RequestParam Integer pageSize,
                            @RequestParam String queryField,
                            @RequestParam String keyword) {
        IPage<Affiliate> page = new Page<>(pageNum, pageSize);
        Page<Affiliate> result = affiliateMapper.selectByPage(page, queryField, keyword);
        return (result != null) ? Result.success(result) : Result.error(Status.CODE_ERROR, "get_photographer_failed");
    }

    /**
     * 一開始先建立 推廣員 的基本資料
     * @param affiliate
     * @return
     */
    @PostMapping
    public Result saveBasicInfo(@RequestBody Affiliate affiliate) {
        boolean result = affiliateService.saveOrUpdateAffiliate(affiliate);
        return result ? Result.success(affiliate) : Result.error(Status.CODE_ERROR, "save_failed");
    }

    /**
     * 取得 推廣員 基本資料
     * @param affid
     * @return
     */
    @GetMapping("/{affid}")
    public Result getOne(@PathVariable Integer affid) {
        Affiliate affiliate = affiliateService.getAffiliateInfoById(affid);
        return (affiliate != null) ? Result.success(affiliate) : Result.error(Status.CODE_ERROR, "get_affiliate_failed");
    }



    /**
     * 查詢推廣員
     * @param keyword
     * @return
     */
    @GetMapping("/q")
    public Result getAffiliateByCritieria(@RequestParam String keyword) {
        List<Affiliate> promoters = affiliateMapper.findByName(keyword);
        return Result.success(promoters) ;
    }

    /**
     * 刪除推廣員
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = affiliateService.deleteById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

}
