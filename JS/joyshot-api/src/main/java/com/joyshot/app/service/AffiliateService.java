package com.joyshot.app.service;

import com.joyshot.app.entity.Affiliate;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【affiliate】的資料庫操作Service
*/
public interface AffiliateService extends IService<Affiliate> {

    boolean saveOrUpdateAffiliate(Affiliate affiliate);

    Affiliate getAffiliateInfoById(Integer affid);

    boolean deleteById(Integer id);
}
