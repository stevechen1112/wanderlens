package com.joyshot.app.controller;


import cn.hutool.log.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.ServiceCategory;
import com.joyshot.app.entity.ServiceCategoryForm;
import com.joyshot.app.entity.User;
import com.joyshot.app.service.ServiceCategoryService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/service-category")
@Api(tags = "ServiceCategoryController")
public class ServiceCategoryController extends AppBaseController {

    private static final Log logger = Log.get();


    @Autowired
    private ServiceCategoryService serviceCategoryService;

    @GetMapping
    public Result findAll(@RequestParam Integer pageNum,
                          @RequestParam Integer pageSize,
                          HttpServletRequest request) {
        String locale = request.getHeader("locale");
        IPage<ServiceCategory> page = new Page<>(pageNum, pageSize);
        Page<ServiceCategory> result = serviceCategoryService.findAll(page, locale);
        return Result.success(result);
    }

    @PostMapping
    public Result save(@RequestBody ServiceCategoryForm form,
                       HttpServletRequest request) {
        User execUser = getExecUser(request);
        String locale = request.getHeader("locale");
        boolean result = false;
        if (form.getId() != null) { //update
            result = serviceCategoryService.doUpdate(form, locale, execUser);
        } else { //insert
            result = serviceCategoryService.doSave(form, locale, execUser);
        }

        return result? Result.success() : Result.error(Status.CODE_ERROR, "insert_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = serviceCategoryService.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }


}
