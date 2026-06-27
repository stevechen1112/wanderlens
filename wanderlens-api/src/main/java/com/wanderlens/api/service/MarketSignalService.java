package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.MarketSignal;

import java.util.List;
import java.util.Map;

public interface MarketSignalService extends IService<MarketSignal> {

    void recordSignal(String sourceCountry, String sourceCity, String signalType, String metadata);

    List<Map<String, Object>> getDashboardSummary(int days);
}
