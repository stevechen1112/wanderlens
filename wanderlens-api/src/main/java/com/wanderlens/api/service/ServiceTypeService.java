package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.ServiceType;

import java.util.List;

public interface ServiceTypeService extends IService<ServiceType> {

    /**
     * 取得所有啟用的拍攝類型
     */
    List<ServiceType> listActive();

    /**
     * 依 ID 取得建議配置
     */
    String getSuggestedConfig(Long serviceTypeId);
}