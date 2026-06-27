package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.entity.LedgerEntry;
import com.wanderlens.api.entity.enums.LedgerEntryType;
import com.wanderlens.api.mapper.LedgerEntryMapper;
import com.wanderlens.api.service.LedgerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class LedgerServiceImpl extends ServiceImpl<LedgerEntryMapper, LedgerEntry> implements LedgerService {

    @Override
    @Transactional
    public void createEntriesOnPayment(Long orderId, Integer totalFee,
                                        Integer platformFeeRate, Integer photographerProfit,
                                        Long photographerId) {
        // 1. 收款分錄
        LedgerEntry receipt = new LedgerEntry();
        receipt.setOrderId(orderId);
        receipt.setEntryType(LedgerEntryType.RECEIPT.getCode());
        receipt.setAmount(totalFee);
        receipt.setStatus("SETTLED");
        receipt.setSettledAt(LocalDateTime.now());
        save(receipt);

        // 2. 平台抽成分錄
        int platformFee = totalFee - photographerProfit;
        if (platformFee > 0) {
            LedgerEntry fee = new LedgerEntry();
            fee.setOrderId(orderId);
            fee.setEntryType(LedgerEntryType.PLATFORM_FEE.getCode());
            fee.setAmount(platformFee);
            fee.setStatus("SETTLED");
            fee.setSettledAt(LocalDateTime.now());
            save(fee);
        }

        // 3. 攝影師應付分錄
        if (photographerProfit > 0) {
            LedgerEntry payable = new LedgerEntry();
            payable.setOrderId(orderId);
            payable.setEntryType(LedgerEntryType.PROVIDER_PAYABLE.getCode());
            payable.setAmount(photographerProfit);
            payable.setProviderId(photographerId);
            payable.setStatus("PENDING");
            save(payable);
        }

        log.info("建立清算分錄: orderId={}, totalFee={}, platformFee={}, photographerProfit={}",
                orderId, totalFee, platformFee, photographerProfit);
    }

    @Override
    @Transactional
    public void payout(Long orderId, Long providerId) {
        LedgerEntry payable = getOne(new LambdaQueryWrapper<LedgerEntry>()
                .eq(LedgerEntry::getOrderId, orderId)
                .eq(LedgerEntry::getEntryType, LedgerEntryType.PROVIDER_PAYABLE.getCode())
                .eq(LedgerEntry::getProviderId, providerId)
                .eq(LedgerEntry::getStatus, "PENDING"));

        if (payable == null) {
            log.warn("無待撥款記錄: orderId={}, providerId={}", orderId, providerId);
            return;
        }

        // 更新應付為已結算
        payable.setStatus("SETTLED");
        payable.setSettledAt(LocalDateTime.now());
        updateById(payable);

        // 建立撥款記錄
        LedgerEntry payout = new LedgerEntry();
        payout.setOrderId(orderId);
        payout.setEntryType(LedgerEntryType.PAYOUT.getCode());
        payout.setAmount(payable.getAmount());
        payout.setProviderId(providerId);
        payout.setStatus("SETTLED");
        payout.setSettledAt(LocalDateTime.now());
        save(payout);

        log.info("撥款完成: orderId={}, providerId={}, amount={}",
                orderId, providerId, payable.getAmount());
    }

    @Override
    public List<LedgerEntry> getEntriesByOrderId(Long orderId) {
        return list(new LambdaQueryWrapper<LedgerEntry>()
                .eq(LedgerEntry::getOrderId, orderId)
                .orderByAsc(LedgerEntry::getCreatedAt));
    }
}