package com.wanderlens.api.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Studio;

import java.time.LocalDate;
import java.util.List;

public interface StudioService extends IService<Studio> {

    /**
     * 依條件搜尋可用攝影棚
     */
    List<Studio> searchAvailable(LocalDate date, String timeStart, String timeEnd, String city, Long serviceTypeId);

    /**
     * 依 UUID 取得攝影棚
     */
    Studio findByUuid(String uuid);

    /**
     * 設定上架狀態
     */
    void setLive(Long studioId, boolean live);

    java.util.List<com.wanderlens.api.entity.StudioAvailability> getSchedule(Long studioId);

    int batchCreateSlots(Long studioId, java.util.List<String> dates, String slotStart, String slotEnd);

    void deleteSlot(Long studioId, Long slotId);

    void lockSlot(Long studioId, LocalDate date, String timeStart, String timeEnd, Long orderId);
}