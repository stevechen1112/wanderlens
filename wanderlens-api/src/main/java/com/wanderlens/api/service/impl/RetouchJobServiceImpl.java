package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.RetouchJob;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.entity.enums.RetouchJobStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.RetouchJobMapper;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.OrderService;
import com.wanderlens.api.service.RetouchJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RetouchJobServiceImpl extends ServiceImpl<RetouchJobMapper, RetouchJob> implements RetouchJobService {

    private final OrderService orderService;
    private final NotifyService notifyService;

    @Override
    @Transactional
    public RetouchJob createJob(Long orderId, Long consumerId, String mediaAssetIds, String spec, Integer fee) {
        // ── 驗證 ──
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        // 驗證消費者身份
        if (!order.getConsumerId().equals(consumerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "非此訂單的消費者");
        }
        // 驗證訂單狀態為已交付
        if (!OrderStatus.DELIVERED.getCode().equals(order.getStatus())) {
            throw new ServiceException(ResultCode.ORDER_STATUS_INVALID, "只有已交付的訂單才能申請精修");
        }
        // 驗證費用合理
        if (fee != null && fee < 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "精修費用不可為負");
        }

        RetouchJob job = new RetouchJob();
        job.setOrderId(orderId);
        job.setConsumerId(consumerId);
        job.setMediaAssetIds(mediaAssetIds);
        job.setSpec(spec);
        job.setFee(fee);
        job.setStatus(RetouchJobStatus.REQUESTED.getCode());

        save(job);

        // 訂單狀態轉移：Delivered → RetouchRequested
        orderService.transition(orderId, OrderStatus.RETOUCH_REQUESTED,
                "RETOUCH_REQUESTED", "消費者申請精修", String.valueOf(consumerId));

        log.info("精修工單建立: orderId={}, jobId={}, fee={}", orderId, job.getId(), fee);
        return job;
    }

    @Override
    @Transactional
    public RetouchJob assign(Long jobId, Long retouchCompanyId, LocalDateTime deliveryDeadline) {
        RetouchJob job = getById(jobId);
        if (job == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "精修工單不存在");
        }

        job.setRetouchCompanyId(retouchCompanyId);
        job.setDeliveryDeadline(deliveryDeadline);
        job.setStatus(RetouchJobStatus.ASSIGNED.getCode());
        updateById(job);

        // 訂單狀態轉移：RetouchRequested → Retouching
        orderService.transition(job.getOrderId(), OrderStatus.RETOUCHING,
                "RETOUCH_ASSIGNED", "已派工給外包修圖公司", "ADMIN");

        // 通知外包公司
        notifyService.triggerFlow("retouch_assigned", retouchCompanyId,
                "新精修工單", "工單 #" + jobId + " 已派工，請儘速處理。");

        log.info("精修工單派工: jobId={}, companyId={}", jobId, retouchCompanyId);
        return job;
    }

    @Override
    @Transactional
    public RetouchJob startProcessing(Long jobId) {
        RetouchJob job = getById(jobId);
        if (job == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "精修工單不存在");
        }
        job.setStatus(RetouchJobStatus.IN_PROGRESS.getCode());
        updateById(job);
        log.info("精修工單開始處理: jobId={}", jobId);
        return job;
    }

    @Override
    @Transactional
    public RetouchJob deliver(Long jobId) {
        RetouchJob job = getById(jobId);
        if (job == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "精修工單不存在");
        }
        job.setStatus(RetouchJobStatus.DELIVERED.getCode());
        updateById(job);

        // 訂單狀態轉移：Retouching → RetouchDelivered
        orderService.transition(job.getOrderId(), OrderStatus.RETOUCH_DELIVERED,
                "RETOUCH_DELIVERED", "精修成品已交付", "RETOUCH_COMPANY");

        // 通知消費者
        notifyService.triggerFlow("retouch_delivered", job.getConsumerId(),
                "精修已完成", "您的精修照片已交付，請至 App 瀏覽。");

        log.info("精修工單交付: jobId={}", jobId);
        return job;
    }

    @Override
    @Transactional
    public RetouchJob reject(Long jobId, String reason) {
        RetouchJob job = getById(jobId);
        if (job == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "精修工單不存在");
        }
        // 驗證狀態為已交付（只有已交付的才能退修）
        if (!RetouchJobStatus.DELIVERED.getCode().equals(job.getStatus())) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "只有已交付的工單才能退修");
        }

        // 先記錄退修歷程（REJECTED 狀態持久化）
        job.setStatus(RetouchJobStatus.REJECTED.getCode());
        updateById(job);
        log.info("精修工單退修記錄: jobId={}, reason={}", jobId, reason);

        // 退回給外包公司重做（REJECTED → ASSIGNED）
        job.setStatus(RetouchJobStatus.ASSIGNED.getCode());
        updateById(job);

        notifyService.triggerFlow("retouch_rejected", job.getRetouchCompanyId(),
                "精修退修", "工單 #" + jobId + " 需退修：" + reason);

        log.info("精修工單退修完成: jobId={}, reason={}", jobId, reason);
        return job;
    }

    @Override
    @Transactional
    public RetouchJob settle(Long jobId) {
        RetouchJob job = getById(jobId);
        if (job == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "精修工單不存在");
        }
        job.setStatus(RetouchJobStatus.SETTLED.getCode());
        updateById(job);

        // 訂單狀態轉移：RetouchDelivered → Closed
        orderService.transition(job.getOrderId(), OrderStatus.CLOSED,
                "RETOUCH_SETTLED", "精修已結算，訂單結案", "ADMIN");

        log.info("精修工單結算: jobId={}", jobId);
        return job;
    }

    @Override
    public List<RetouchJob> getByOrderId(Long orderId) {
        return list(new LambdaQueryWrapper<RetouchJob>()
                .eq(RetouchJob::getOrderId, orderId)
                .orderByDesc(RetouchJob::getCreatedAt));
    }

    @Override
    public List<RetouchJob> listByCompanyId(Long companyId) {
        return list(new LambdaQueryWrapper<RetouchJob>()
                .eq(RetouchJob::getRetouchCompanyId, companyId)
                .orderByDesc(RetouchJob::getCreatedAt));
    }

    @Override
    public List<RetouchJob> listByConsumerId(Long consumerId) {
        return list(new LambdaQueryWrapper<RetouchJob>()
                .eq(RetouchJob::getConsumerId, consumerId)
                .orderByDesc(RetouchJob::getCreatedAt));
    }
}