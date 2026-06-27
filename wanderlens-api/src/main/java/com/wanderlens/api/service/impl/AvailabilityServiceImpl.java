package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.AppConstant;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Availability;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.AvailabilityMapper;
import com.wanderlens.api.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl extends ServiceImpl<AvailabilityMapper, Availability> implements AvailabilityService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public List<Availability> findAvailable(Long providerId, LocalDate startDate, LocalDate endDate) {
        return baseMapper.findAvailable(providerId, startDate.toString(), endDate.toString());
    }

    @Override
    @Transactional
    public boolean lockSlot(Long availabilityId, Long orderId) {
        String lockKey = AppConstant.REDIS_LOCK_PREFIX + availabilityId;

        // Redis 分散式鎖
        Boolean locked = redisTemplate.opsForValue().setIfAbsent(
                lockKey, orderId.toString(), Duration.ofSeconds(AppConstant.SLOT_LOCK_TTL_SECONDS));

        if (Boolean.FALSE.equals(locked)) {
            throw new ServiceException(ResultCode.SLOT_LOCKED);
        }

        // DB 層面鎖定
        Availability availability = getById(availabilityId);
        if (availability == null) {
            redisTemplate.delete(lockKey);
            throw new ServiceException(ResultCode.NOT_FOUND, "時段不存在");
        }
        if (availability.getLockedByOrderId() != null) {
            redisTemplate.delete(lockKey);
            throw new ServiceException(ResultCode.SLOT_LOCKED);
        }

        availability.setLockedByOrderId(orderId);
        boolean success = updateById(availability);
        if (!success) {
            redisTemplate.delete(lockKey);
            throw new ServiceException(ResultCode.SLOT_LOCKED);
        }

        // 若外層交易最終回滾，DB 的 locked_by_order_id 會被還原，
        // 但 Redis 分散式鎖不在交易範圍內，需在回滾後一併釋放，避免時段被鎖定整個 TTL。
        registerLockReleaseOnRollback(lockKey);

        log.info("時段鎖定: availabilityId={}, orderId={}", availabilityId, orderId);
        return true;
    }

    private void registerLockReleaseOnRollback(String lockKey) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    redisTemplate.delete(lockKey);
                    log.info("交易回滾，釋放檔期 Redis 鎖: {}", lockKey);
                }
            }
        });
    }

    @Override
    @Transactional
    public boolean unlockSlot(Long availabilityId) {
        Availability availability = getById(availabilityId);
        if (availability == null) {
            return false;
        }

        availability.setLockedByOrderId(null);
        boolean success = updateById(availability);

        // 釋放 Redis 鎖
        redisTemplate.delete(AppConstant.REDIS_LOCK_PREFIX + availabilityId);

        log.info("時段解鎖: availabilityId={}", availabilityId);
        return success;
    }

    @Override
    @Transactional
    public void unlockSlotByOrderId(Long orderId) {
        // 查找所有被該訂單鎖定的時段
        List<Availability> lockedSlots = list(new LambdaQueryWrapper<Availability>()
                .eq(Availability::getLockedByOrderId, orderId));

        for (Availability slot : lockedSlots) {
            slot.setLockedByOrderId(null);
            updateById(slot);
            redisTemplate.delete(AppConstant.REDIS_LOCK_PREFIX + slot.getId());
        }

        if (!lockedSlots.isEmpty()) {
            log.info("依訂單解鎖時段: orderId={}, slots={}", orderId, lockedSlots.size());
        }
    }

    @Override
    public boolean isAvailable(Long providerId, LocalDate date, String start, String end) {
        LocalTime startTime = LocalTime.parse(start);
        LocalTime endTime = LocalTime.parse(end);

        List<Availability> slots = list(new LambdaQueryWrapper<Availability>()
                .eq(Availability::getProviderId, providerId)
                .eq(Availability::getScheduleDate, date)
                .eq(Availability::getActive, "Y")
                .isNull(Availability::getLockedByOrderId));

        for (Availability slot : slots) {
            if (!startTime.isBefore(slot.getSlotStart()) && !endTime.isAfter(slot.getSlotEnd())) {
                return true;
            }
        }
        return false;
    }

    @Override
    @Transactional
    public int batchCreateSlots(Long providerId, List<String> dates, String slotStart, String slotEnd) {
        LocalTime start = LocalTime.parse(slotStart);
        LocalTime end = LocalTime.parse(slotEnd);
        if (!start.isBefore(end)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "結束時間必須晚於開始時間");
        }

        int created = 0;
        for (String dateStr : dates) {
            LocalDate date = LocalDate.parse(dateStr);
            long exists = count(new LambdaQueryWrapper<Availability>()
                    .eq(Availability::getProviderId, providerId)
                    .eq(Availability::getScheduleDate, date)
                    .eq(Availability::getSlotStart, start)
                    .eq(Availability::getSlotEnd, end));
            if (exists > 0) continue;

            Availability slot = new Availability();
            slot.setProviderId(providerId);
            slot.setScheduleDate(date);
            slot.setSlotStart(start);
            slot.setSlotEnd(end);
            slot.setActive("Y");
            slot.setMaxValue(1);
            save(slot);
            created++;
        }
        return created;
    }

    @Override
    @Transactional
    public int batchBlockSlots(Long providerId, List<String> dates, String slotStart, String slotEnd) {
        LocalTime start = LocalTime.parse(slotStart);
        LocalTime end = LocalTime.parse(slotEnd);
        if (!start.isBefore(end)) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "結束時間必須晚於開始時間");
        }

        int created = 0;
        int updated = 0;
        for (String dateStr : dates) {
            LocalDate date = LocalDate.parse(dateStr);
            Availability existing = getOne(new LambdaQueryWrapper<Availability>()
                    .eq(Availability::getProviderId, providerId)
                    .eq(Availability::getScheduleDate, date)
                    .eq(Availability::getSlotStart, start)
                    .eq(Availability::getSlotEnd, end)
                    .last("LIMIT 1"));
            if (existing != null) {
                if (existing.getLockedByOrderId() != null) {
                    continue;
                }
                if (!"N".equals(existing.getActive())) {
                    existing.setActive("N");
                    existing.setMaxValue(0);
                    updateById(existing);
                    updated++;
                }
                continue;
            }

            Availability slot = new Availability();
            slot.setProviderId(providerId);
            slot.setScheduleDate(date);
            slot.setSlotStart(start);
            slot.setSlotEnd(end);
            slot.setActive("N");
            slot.setMaxValue(0);
            save(slot);
            created++;
        }
        return created + updated;
    }

    @Override
    @Transactional
    public void deleteSlot(Long providerId, Long slotId) {
        Availability slot = getById(slotId);
        if (slot == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "時段不存在");
        }
        if (!slot.getProviderId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限刪除此時段");
        }
        if (slot.getLockedByOrderId() != null) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "已預約時段無法刪除");
        }
        removeById(slotId);
    }
}