package com.joyshot.app.controller;

import cn.hutool.log.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Faq;
import com.joyshot.app.entity.ServiceCat;
import com.joyshot.app.service.FaqService;
import com.joyshot.app.service.ServiceCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/faq")
public class FaqController extends AppBaseController {

    private static final Log logger = Log.get();

    @Autowired
    private FaqService faqService;

    @GetMapping
    public Result findAll(@RequestParam Integer pageNum,
                          @RequestParam Integer pageSize,
                          @RequestParam(required=false) String lang,
                          HttpServletRequest request) {
        String locale = request.getHeader("locale");
        IPage<Faq> page = new Page<>(pageNum, pageSize);
        Page<Faq> result = faqService.selectByPage(page, lang);
        return Result.success(result);
    }

    @PostMapping
    public Result save(@RequestBody Faq faq) {
        boolean result = faqService.saveOrUpdate(faq);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = faqService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

}
