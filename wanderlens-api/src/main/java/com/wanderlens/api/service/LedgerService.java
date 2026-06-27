package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.LedgerEntry;

import java.util.List;

public interface LedgerService extends IService<LedgerEntry> {

    /**
     * 付款成功時建立清算分錄
     */
    void createEntriesOnPayment(Long orderId, Integer totalFee, Integer platformFeeRate, Integer photographerProfit, Long photographerId);

    /**
     * 撥款
     */
    void payout(Long orderId, Long providerId);

    /**
     * 依訂單取得清算記錄
     */
    List<LedgerEntry> getEntriesByOrderId(Long orderId);
}