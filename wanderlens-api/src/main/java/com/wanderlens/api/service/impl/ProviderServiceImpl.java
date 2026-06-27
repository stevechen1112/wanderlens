package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.dto.ProviderApplyRequest;
import com.wanderlens.api.entity.enums.ProviderType;
import com.wanderlens.api.entity.enums.ViolationLevel;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.service.ProviderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class ProviderServiceImpl extends ServiceImpl<ProviderMapper, Provider> implements ProviderService {

    @Override
    public Provider apply(ProviderApplyRequest request) {
        // 檢查電話是否已註冊
        long count = count(new LambdaQueryWrapper<Provider>()
                .eq(Provider::getPhone, request.getPhone())
                .eq(Provider::getProviderType, ProviderType.PHOTOGRAPHER.getCode()));
        if (count > 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "此電話號碼已申請過");
        }

        Provider provider = new Provider();
        provider.setProviderUuid(UUID.randomUUID().toString());
        provider.setProviderType(ProviderType.PHOTOGRAPHER.getCode());
        provider.setName(request.getName());
        provider.setPhone(request.getPhone());
        provider.setEmail(request.getEmail());
        provider.setCity(request.getCity());
        provider.setDistrictName(request.getDistrictName());
        provider.setAddress(request.getAddress());
        provider.setServiceItem(request.getServiceItem());
        provider.setIntro(request.getIntro());
        provider.setRating(new BigDecimal("0.0"));
        provider.setGoLive("N");
        provider.setViolationCount(0);
        provider.setViolationLevel(ViolationLevel.NONE.getCode());
        provider.setReviewStatus("PENDING");

        save(provider);
        log.info("攝影師註冊申請: name={}, phone={}, uuid={}",
                request.getName(), request.getPhone(), provider.getProviderUuid());

        return provider;
    }

    @Override
    public Provider findByUuid(String uuid) {
        Provider provider = getOne(new LambdaQueryWrapper<Provider>()
                .eq(Provider::getProviderUuid, uuid)
                .eq(Provider::getGoLive, "Y"));
        if (provider == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }
        return provider;
    }

    @Override
    public void setLive(Long providerId, boolean live) {
        Provider provider = getById(providerId);
        if (provider == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }
        provider.setGoLive(live ? "Y" : "N");
        updateById(provider);
        log.info("供給方上架狀態變更: id={}, live={}", providerId, live);
    }
}