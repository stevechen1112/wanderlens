package com.wanderlens.api.service;

import com.wanderlens.api.entity.Provider;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface StylistService {

    /**
     * 依條件搜尋可用造型師
     */
    List<Provider> searchAvailable(LocalDate date, String timeStart, String timeEnd, String city);

    /**
     * 計算造型師到場時間（拍攝時間 - 前置緩衝）
     *
     * 範例：拍攝 10:00，緩衝 90 分鐘 → 造型師 08:30 到場
     */
    LocalTime calculateArrivalTime(LocalTime shootStart, int bufferMinutes);

    /**
     * 計算造型師工作時段（到場時間 ~ 拍攝開始 + 30 分鐘收尾）
     */
    String calculateWorkSlot(LocalTime shootStart, int bufferMinutes);
}