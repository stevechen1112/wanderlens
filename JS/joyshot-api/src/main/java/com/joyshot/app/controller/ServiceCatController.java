package com.joyshot.app.controller;


import cn.hutool.log.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.ServiceCat;
import com.joyshot.app.entity.ServiceCategory;
import com.joyshot.app.entity.ServiceCategoryForm;
import com.joyshot.app.entity.User;
import com.joyshot.app.mapper.ServiceCatMapper;
import com.joyshot.app.service.ServiceCatService;
import com.joyshot.app.service.ServiceCategoryService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/service-cat")
public class ServiceCatController extends AppBaseController {

    private static final Log logger = Log.get();


    @Autowired
    private ServiceCatService serviceCatService;

    @Autowired
    private ServiceCatMapper serviceCatMapper;



    @GetMapping
    public Result findAll(@RequestParam Integer pageNum,
                          @RequestParam Integer pageSize,
                          HttpServletRequest request) {
        String locale = request.getHeader("locale");
        IPage<ServiceCat> page = new Page<>(pageNum, pageSize);
        Page<ServiceCat> result = serviceCatMapper.selectAll(page);
        return Result.success(result);
    }

    @PostMapping
    public Result save(@RequestBody ServiceCat serviceCat) {
        boolean result = serviceCatService.saveOrUpdate(serviceCat);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean result = serviceCatService.removeById(id);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }


}
