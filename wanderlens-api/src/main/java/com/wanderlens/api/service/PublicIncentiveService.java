package com.wanderlens.api.service;

/**
 * 公開授權激勵（同意公開作品可獲折抵券）
 */
public interface PublicIncentiveService {

    void grantPortfolioReward(Long consumerId, Long albumId);
}
