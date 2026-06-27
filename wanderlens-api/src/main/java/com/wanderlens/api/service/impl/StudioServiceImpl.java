package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Studio;
import com.wanderlens.api.entity.StudioAvailability;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.StudioAvailabilityMapper;
import com.wanderlens.api.mapper.StudioMapper;
import com.wanderlens.api.service.StudioService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudioServiceImpl extends ServiceImpl<StudioMapper, Studio> implements StudioService {

    private final StudioAvailabilityMapper studioAvailabilityMapper;

    @Override
    public List<Studio> searchAvailable(LocalDate date, String timeStart, String timeEnd,
                                         String city, Long serviceTypeId) {
        // 1. 查符合條件的上架攝影棚
        LambdaQueryWrapper<Studio> wrapper = new LambdaQueryWrapper<Studio>()
                .eq(Studio::getGoLive, "Y");

        if (city != null && !city.isEmpty()) {
            wrapper.eq(Studio::getCity, city);
        }
        if (serviceTypeId != null) {
            wrapper.apply("FIND_IN_SET({0}, supported_service_types)", serviceTypeId.toString());
        }

        List<Studio> studios = list(wrapper);

        // 2. 依檔期可用性過濾
        LocalTime startTime = LocalTime.parse(timeStart);
        LocalTime endTime = LocalTime.parse(timeEnd);

        return studios.stream().filter(studio -> {
            List<StudioAvailability> slots = studioAvailabilityMapper.selectList(
                    new LambdaQueryWrapper<StudioAvailability>()
                            .eq(StudioAvailability::getStudioId, studio.getId())
                            .eq(StudioAvailability::getScheduleDate, date)
                            .eq(StudioAvailability::getActive, "Y")
                            .isNull(StudioAvailability::getLockedByOrderId));

            return slots.stream().anyMatch(slot ->
                    !startTime.isBefore(slot.getSlotStart()) && !endTime.isAfter(slot.getSlotEnd()));
        }).collect(Collectors.toList());
    }

    @Override
    public Studio findByUuid(String uuid) {
        Studio studio = getOne(new LambdaQueryWrapper<Studio>()
                .eq(Studio::getStudioUuid, uuid)
                .eq(Studio::getGoLive, "Y"));
        if (studio == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "攝影棚不存在");
        }
        return studio;
    }

    @Override
    public void setLive(Long studioId, boolean live) {
        Studio studio = getById(studioId);
        if (studio == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "攝影棚不存在");
        }
        studio.setGoLive(live ? "Y" : "N");
        updateById(studio);
        log.info("攝影棚上架狀態變更: id={}, live={}", studioId, live);
    }

    @Override
    public List<StudioAvailability> getSchedule(Long studioId) {
        return studioAvailabilityMapper.selectList(new LambdaQueryWrapper<StudioAvailability>()
                .eq(StudioAvailability::getStudioId, studioId)
                .orderByAsc(StudioAvailability::getScheduleDate)
                .orderByAsc(StudioAvailability::getSlotStart));
    }

    @Override
    public int batchCreateSlots(Long studioId, List<String> dates, String slotStart, String slotEnd) {
        LocalTime start = LocalTime.parse(slotStart);
        LocalTime end = LocalTime.parse(slotEnd);
        if (!start.isBefore(end)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "結束時間必須晚於開始時間");
        }
        int created = 0;
        for (String dateStr : dates) {
            LocalDate date = LocalDate.parse(dateStr);
            long exists = studioAvailabilityMapper.selectCount(new LambdaQueryWrapper<StudioAvailability>()
                    .eq(StudioAvailability::getStudioId, studioId)
                    .eq(StudioAvailability::getScheduleDate, date)
                    .eq(StudioAvailability::getSlotStart, start)
                    .eq(StudioAvailability::getSlotEnd, end));
            if (exists > 0) continue;
            StudioAvailability slot = new StudioAvailability();
            slot.setStudioId(studioId);
            slot.setScheduleDate(date);
            slot.setSlotStart(start);
            slot.setSlotEnd(end);
            slot.setActive("Y");
            studioAvailabilityMapper.insert(slot);
            created++;
        }
        return created;
    }

    @Override
    public void deleteSlot(Long studioId, Long slotId) {
        StudioAvailability slot = studioAvailabilityMapper.selectById(slotId);
        if (slot == null || !slot.getStudioId().equals(studioId)) {
            throw new ServiceException(ResultCode.NOT_FOUND, "時段不存在");
        }
        if (slot.getLockedByOrderId() != null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "已預約時段無法刪除");
        }
        studioAvailabilityMapper.deleteById(slotId);
    }

    @Override
    public void lockSlot(Long studioId, LocalDate date, String timeStart, String timeEnd, Long orderId) {
        LocalTime start = LocalTime.parse(timeStart);
        LocalTime end = LocalTime.parse(timeEnd);
        List<StudioAvailability> slots = studioAvailabilityMapper.selectList(new LambdaQueryWrapper<StudioAvailability>()
                .eq(StudioAvailability::getStudioId, studioId)
                .eq(StudioAvailability::getScheduleDate, date)
                .eq(StudioAvailability::getActive, "Y")
                .isNull(StudioAvailability::getLockedByOrderId));
        for (StudioAvailability slot : slots) {
            if (!start.isBefore(slot.getSlotStart()) && !end.isAfter(slot.getSlotEnd())) {
                slot.setLockedByOrderId(orderId);
                studioAvailabilityMapper.updateById(slot);
                return;
            }
        }
        throw new ServiceException(ResultCode.BAD_REQUEST, "攝影棚時段不可用");
    }
}