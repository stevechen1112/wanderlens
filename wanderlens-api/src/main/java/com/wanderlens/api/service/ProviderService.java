package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.dto.ProviderApplyRequest;

public interface ProviderService extends IService<Provider> {

    /**
     * 攝影師註冊申請
     */
    Provider apply(ProviderApplyRequest request);

    /**
     * 依 UUID 取得供給方（前台用）
     */
    Provider findByUuid(String uuid);

    /**
     * 設定上架狀態
     */
    void setLive(Long providerId, boolean live);
}