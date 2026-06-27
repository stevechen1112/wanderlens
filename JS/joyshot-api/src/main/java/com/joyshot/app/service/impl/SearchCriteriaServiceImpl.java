package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.PhotographerSearchForm;
import com.joyshot.app.entity.SearchCriteria;
import com.joyshot.app.service.SearchCriteriaService;
import com.joyshot.app.mapper.SearchCriteriaMapper;
import org.springframework.stereotype.Service;

/**
* @author avery
* @description【search_criteria】的資料庫操作Service实现
*/
@Service
public class SearchCriteriaServiceImpl extends ServiceImpl<SearchCriteriaMapper, SearchCriteria>
    implements SearchCriteriaService{

    @Override
    public void saveSearchCriteria(PhotographerSearchForm form) {
        SearchCriteria sc = new SearchCriteria();
        sc.setQueryService(form.getQuery_service());
        sc.setQueryDate(form.getQuery_date());
        sc.setQueryHour(form.getQuery_hour());
        sc.setQueryMinute(form.getQuery_minute());
        sc.setQueryDuration(form.getQuery_duration());
        sc.setQueryPlaceId(form.getQuery_placeId());
        sc.setQueryPlaceName(form.getQuery_placeName());
        sc.setQueryLocation(form.getQuery_location());
        sc.setLat(form.getLat());
        sc.setLng(form.getLng());
        sc.setCity(form.getCity());
        sc.setCityArea(form.getCity_area());
        sc.setAdults(form.getAdults());
        sc.setChildren(form.getChildren());
        sc.setCheckpets(form.getPetsStatus());
        sc.setPetsnote(form.getPetsNote());
        sc.setQueryAssignPhotographer(form.getQuery_assign_photographer());
        sc.setQueryAssignPhUuid(form.getQuery_assign_ph_uuid());
        this.save(sc);
    }
}




