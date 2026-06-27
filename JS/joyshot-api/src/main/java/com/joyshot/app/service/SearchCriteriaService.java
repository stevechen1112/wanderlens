package com.joyshot.app.service;

import com.joyshot.app.entity.PhotographerSearchForm;
import com.joyshot.app.entity.SearchCriteria;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【search_criteria】的資料庫操作Service
*/
public interface SearchCriteriaService extends IService<SearchCriteria> {

    void saveSearchCriteria(PhotographerSearchForm form);
}
