package com.joyshot.app.controller;


import cn.hutool.log.Log;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.entity.PhotographerSearchForm;
import com.joyshot.app.service.PhotographerService;
import com.joyshot.app.service.SearchCriteriaService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 * 負責搜尋攝影師
 */
@RestController
@RequestMapping("/api/search")
@Api(tags = "UserController")
public class SearchingController extends AppBaseController {

    private static final Log logger = Log.get();

    @Autowired
    private PhotographerService photographerService;

    @Autowired
    private SearchCriteriaService searchCriteriaService;

    @PostMapping("/photographer")
    public Result search(@RequestBody PhotographerSearchForm form) {
        List<Photographer> photographerList = photographerService.search(form);
        return photographerList != null ? Result.success(photographerList) : Result.error(Status.CODE_ERROR, "search_failed");
    }

    @PostMapping("/saveSearch")
    public Result saveSearchCriteria(@RequestBody PhotographerSearchForm form) {
        searchCriteriaService.saveSearchCriteria(form);
        return true ? Result.success() : Result.error(Status.CODE_ERROR, "save_search_criteria_failed");
    }

}
