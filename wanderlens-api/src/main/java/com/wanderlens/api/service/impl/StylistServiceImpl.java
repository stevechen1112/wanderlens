package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.Availability;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.enums.ProviderType;
import com.wanderlens.api.mapper.AvailabilityMapper;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.StylistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 造型師服務實作
 *
 * 核心設計：造型師須於攝影師起拍前完成妝髮工作，
 * 系統自動計算前置緩衝時段。
 *
 * 範例：10:00 拍攝 → 造型師 08:30 到場（90 分鐘緩衝）
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StylistServiceImpl implements StylistService {

    private final ProviderMapper providerMapper;
    private final AvailabilityMapper availabilityMapper;
    private final AvailabilityService availabilityService;

    /** 預設前置緩衝（分鐘） */
    private static final int DEFAULT_BUFFER_MINUTES = 90;

    @Override
    public List<Provider> searchAvailable(LocalDate date, String timeStart, String timeEnd, String city) {
        // 造型師的到場時間 = 拍攝開始 - 緩衝
        LocalTime shootStart = LocalTime.parse(timeStart);
        LocalTime arrivalTime = calculateArrivalTime(shootStart, DEFAULT_BUFFER_MINUTES);
        LocalTime shootEnd = LocalTime.parse(timeEnd);

        // 查符合條件的上架造型師
        LambdaQueryWrapper<Provider> wrapper = new LambdaQueryWrapper<Provider>()
                .eq(Provider::getProviderType, ProviderType.STYLIST.getCode())
                .eq(Provider::getGoLive, "Y");

        if (city != null && !city.isEmpty()) {
            wrapper.eq(Provider::getCity, city);
        }

        List<Provider> stylists = providerMapper.selectList(wrapper);

        // 依檔期可用性過濾（造型師的時段需涵蓋 到場時間 ~ 拍攝結束）
        return stylists.stream().filter(stylist -> {
            List<Availability> slots = availabilityMapper.findAvailable(
                    stylist.getId(), date.toString(), date.toString());

            return slots.stream().anyMatch(slot ->
                    !arrivalTime.isBefore(slot.getSlotStart()) && !shootEnd.isAfter(slot.getSlotEnd()));
        }).collect(Collectors.toList());
    }

    @Override
    public LocalTime calculateArrivalTime(LocalTime shootStart, int bufferMinutes) {
        return shootStart.minusMinutes(bufferMinutes);
    }

    @Override
    public String calculateWorkSlot(LocalTime shootStart, int bufferMinutes) {
        LocalTime arrival = calculateArrivalTime(shootStart, bufferMinutes);
        // 造型師工作到拍攝開始後 30 分鐘（收尾）
        LocalTime workEnd = shootStart.plusMinutes(30);
        return arrival + "~" + workEnd;
    }
}