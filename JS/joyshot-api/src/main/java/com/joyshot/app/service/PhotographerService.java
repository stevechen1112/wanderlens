package com.joyshot.app.service;

import com.joyshot.app.entity.Photographer;
import com.baomidou.mybatisplus.extension.service.IService;
import com.joyshot.app.entity.PhotographerSearchForm;

import java.util.List;

/**
* @author avery
* @description【photographer】的資料庫操作Service
*/
public interface PhotographerService extends IService<Photographer> {

    List<Photographer> search(PhotographerSearchForm form);

    Photographer getPhotographerInfoById(Integer pid);

    boolean deleteById(Integer id);

    Photographer getPhotographerInfoByUuid(String uuid);

    boolean saveOrUpdatePhotographer(Photographer photographer);
}
