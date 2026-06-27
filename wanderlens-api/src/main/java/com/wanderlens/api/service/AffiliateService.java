package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.AffiliatePartner;

import java.util.List;

public interface AffiliateService extends IService<AffiliatePartner> {
    List<AffiliatePartner> listAll();
    AffiliatePartner savePartner(AffiliatePartner partner);
    void deletePartner(Long id);
    void recordClick(String referralCode, String sourceUrl, String ip, String userAgent);
    void recordConversion(String referralCode, Long orderId, int orderAmount);
}
