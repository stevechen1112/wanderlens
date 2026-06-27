package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.RetouchJob;

import java.time.LocalDateTime;
import java.util.List;

public interface RetouchJobService extends IService<RetouchJob> {

    /**
     * 建立精修工單（消費者選片後觸發）
     */
    RetouchJob createJob(Long orderId, Long consumerId, String mediaAssetIds, String spec, Integer fee);

    /**
     * 派工給外包修圖公司
     */
    RetouchJob assign(Long jobId, Long retouchCompanyId, LocalDateTime deliveryDeadline);

    /**
     * 外包公司回報開始處理
     */
    RetouchJob startProcessing(Long jobId);

    /**
     * 外包公司交付成品
     */
    RetouchJob deliver(Long jobId);

    /**
     * 退修
     */
    RetouchJob reject(Long jobId, String reason);

    /**
     * 結算
     */
    RetouchJob settle(Long jobId);

    /**
     * 依訂單取得精修工單
     */
    List<RetouchJob> getByOrderId(Long orderId);

    /**
     * 依修圖公司取得工單列表
     */
    List<RetouchJob> listByCompanyId(Long companyId);

    /**
     * 依消費者取得工單列表
     */
    List<RetouchJob> listByConsumerId(Long consumerId);
}