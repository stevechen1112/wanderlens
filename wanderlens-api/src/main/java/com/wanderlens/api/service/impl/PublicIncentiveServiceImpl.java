package com.wanderlens.api.service.impl;

import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.PublicIncentiveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PublicIncentiveServiceImpl implements PublicIncentiveService {

    private static final String REWARD_CODE_PREFIX = "PUBLIC";

    private final NotifyService notifyService;

    @Override
    public void grantPortfolioReward(Long consumerId, Long albumId) {
        String couponCode = REWARD_CODE_PREFIX + albumId;
        notifyService.triggerFlow("public_incentive", consumerId,
                "公開授權感謝禮",
                "感謝您授權作品公開展示！下次預約可使用優惠碼 " + couponCode + " 折抵 NT$100。");
        log.info("公開授權激勵已發放: consumerId={}, albumId={}, code={}", consumerId, albumId, couponCode);
    }
}
