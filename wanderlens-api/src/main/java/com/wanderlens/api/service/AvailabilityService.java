package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Availability;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityService extends IService<Availability> {

    /**
     * 依供給方 ID + 日期查詢可用時段
     */
    List<Availability> findAvailable(Long providerId, LocalDate startDate, LocalDate endDate);

    /**
     * 鎖定時段（選到即確定）
     */
    boolean lockSlot(Long availabilityId, Long orderId);

    /**
     * 解鎖時段（取消預約）
     */
    boolean unlockSlot(Long availabilityId);

    /**
     * 依訂單 ID 解鎖所有被該訂單鎖定的時段
     */
    void unlockSlotByOrderId(Long orderId);

    /**
     * 檢查時段是否可預約
     */
    boolean isAvailable(Long providerId, LocalDate date, String start, String end);

    /**
     * 批次新增可接案時段
     */
    int batchCreateSlots(Long providerId, List<String> dates, String slotStart, String slotEnd);

    /**
     * 刪除未鎖定的時段
     */
    void deleteSlot(Long providerId, Long slotId);

    /**
     * 批次新增封鎖時段（不可預約）
     */
    int batchBlockSlots(Long providerId, List<String> dates, String slotStart, String slotEnd);
}