package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.AffiliateClick;
import com.wanderlens.api.entity.AffiliatePartner;
import com.wanderlens.api.mapper.AffiliateClickMapper;
import com.wanderlens.api.mapper.AffiliatePartnerMapper;
import com.wanderlens.api.service.AffiliateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AffiliateServiceImpl extends ServiceImpl<AffiliatePartnerMapper, AffiliatePartner> implements AffiliateService {

    private final AffiliateClickMapper affiliateClickMapper;

    @Override
    public List<AffiliatePartner> listAll() {
        return list(new LambdaQueryWrapper<AffiliatePartner>().orderByDesc(AffiliatePartner::getCreatedAt));
    }

    @Override
    @Transactional
    public AffiliatePartner savePartner(AffiliatePartner partner) {
        if (partner.getReferralCode() == null || partner.getReferralCode().isBlank()) {
            partner.setReferralCode("WL" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (partner.getCommissionRate() == null) {
            partner.setCommissionRate(new BigDecimal("5.00"));
        }
        if (partner.getStatus() == null) {
            partner.setStatus("active");
        }
        if (partner.getClickCount() == null) partner.setClickCount(0);
        if (partner.getConversionCount() == null) partner.setConversionCount(0);
        if (partner.getTotalCommission() == null) partner.setTotalCommission(0);
        saveOrUpdate(partner);
        return partner;
    }

    @Override
    @Transactional
    public void deletePartner(Long id) {
        removeById(id);
    }

    @Override
    @Transactional
    public void recordClick(String referralCode, String sourceUrl, String ip, String userAgent) {
        AffiliatePartner partner = getOne(new LambdaQueryWrapper<AffiliatePartner>()
                .eq(AffiliatePartner::getReferralCode, referralCode)
                .eq(AffiliatePartner::getStatus, "active"));
        if (partner == null) return;

        AffiliateClick click = new AffiliateClick();
        click.setAffiliateId(partner.getId());
        click.setReferralCode(referralCode);
        click.setSourceUrl(sourceUrl);
        click.setIpAddress(ip);
        click.setUserAgent(userAgent);
        click.setConverted(false);
        affiliateClickMapper.insert(click);

        partner.setClickCount(partner.getClickCount() + 1);
        updateById(partner);
    }

    @Override
    @Transactional
    public void recordConversion(String referralCode, Long orderId, int orderAmount) {
        AffiliatePartner partner = getOne(new LambdaQueryWrapper<AffiliatePartner>()
                .eq(AffiliatePartner::getReferralCode, referralCode));
        if (partner == null) return;

        int commission = BigDecimal.valueOf(orderAmount)
                .multiply(partner.getCommissionRate())
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP)
                .intValue();

        partner.setConversionCount(partner.getConversionCount() + 1);
        partner.setTotalCommission(partner.getTotalCommission() + commission);
        updateById(partner);

        AffiliateClick click = affiliateClickMapper.selectOne(new LambdaQueryWrapper<AffiliateClick>()
                .eq(AffiliateClick::getReferralCode, referralCode)
                .eq(AffiliateClick::getConverted, false)
                .orderByDesc(AffiliateClick::getCreatedAt)
                .last("LIMIT 1"));
        if (click != null) {
            click.setConverted(true);
            click.setOrderId(orderId);
            affiliateClickMapper.updateById(click);
        }
    }
}
