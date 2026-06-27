package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.MediaAsset;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.enums.AlbumType;
import com.wanderlens.api.entity.enums.AssetStatus;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.MediaAssetMapper;
import com.wanderlens.api.service.AlbumService;
import com.wanderlens.api.service.MediaInterfaceService;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaInterfaceServiceImpl implements MediaInterfaceService {

    private final MediaAssetMapper mediaAssetMapper;
    private final OrderService orderService;
    private final NotifyService notifyService;
    private final AlbumService albumService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String UPLOAD_TOKEN_PREFIX = "media:upload-token:";

    @Override
    public String issueUploadToken(Long orderId, Long providerId, String assetType) {
        // 驗證訂單存在且攝影師匹配（IDOR 防護）
        com.wanderlens.api.entity.Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        if (!providerId.equals(order.getPhotographerId())) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限上傳此訂單的檔案");
        }

        if (OrderStatus.SHOOTING_ENDED.getCode().equals(order.getStatus())) {
            orderService.transition(orderId, OrderStatus.UPLOADING_RAW,
                    "RAW_UPLOAD_START", "攝影師開始上傳媒體檔案", String.valueOf(providerId));
        }

        String token = UUID.randomUUID().toString();
        String key = UPLOAD_TOKEN_PREFIX + token;

        redisTemplate.opsForValue().set(key,
                orderId + ":" + providerId + ":" + assetType,
                Duration.ofMinutes(30));

        log.info("核發上傳憑證: orderId={}, providerId={}, assetType={}", orderId, providerId, assetType);
        return token;
    }

    @Override
    @Transactional
    public void handleVerifyResult(Long orderId, boolean success, int fileCount, long totalSize, String detail) {
        log.info("驗收回報: orderId={}, success={}, fileCount={}, totalSize={}",
                orderId, success, fileCount, totalSize);

        if (success) {
            // 狀態轉移：UploadingRaw → AiProcessing
            orderService.transition(orderId, OrderStatus.AI_PROCESSING,
                    "RAW_VERIFY_SUCCESS", "驗收成功: " + fileCount + " 檔案, " + totalSize + " bytes", "MEDIA");
        } else {
            log.warn("驗收失敗: orderId={}, detail={}", orderId, detail);
            Order order = orderService.getById(orderId);
            if (order != null) {
                notifyService.triggerFlow("upload_reminder", order.getPhotographerId(),
                        "RAW 驗收失敗",
                        "訂單 " + order.getOrderNo() + " 驗收失敗，請重新上傳。原因：" + detail);
            }
        }
    }

    @Override
    @Transactional
    public void handleAiStatus(Long orderId, String status, String detail) {
        log.info("AI 狀態回報: orderId={}, status={}, detail={}", orderId, status, detail);

        // 更新 MediaAsset 狀態
        List<MediaAsset> assets = mediaAssetMapper.selectList(
                new LambdaQueryWrapper<MediaAsset>().eq(MediaAsset::getOrderId, orderId));

        for (MediaAsset asset : assets) {
            asset.setStatus(status);
            mediaAssetMapper.updateById(asset);
        }
    }

    @Override
    @Transactional
    public void handleAiComplete(Long orderId, List<String> assetUrls) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }

        Album album = albumService.getOne(new LambdaQueryWrapper<Album>()
                .eq(Album::getOrderId, orderId).last("LIMIT 1"));
        if (album == null) {
            album = new Album();
            album.setOrderId(orderId);
            album.setConsumerId(order.getConsumerId());
            album.setPhotographerId(order.getPhotographerId());
            album.setTitle(order.getShootingLocation() != null ? order.getShootingLocation() : "拍攝相簿");
            album.setShootDate(order.getShootingDate());
            album.setShootLocation(order.getShootingLocation());
            album.setCity(inferCity(order.getShootingLocation()));
            album.setServiceTypeId(order.getServiceTypeId());
            album.setAlbumType(AlbumType.PRIVATE.getCode());
            albumService.save(album);
        }

        List<MediaAsset> assets = new ArrayList<>();
        for (String url : assetUrls) {
            MediaAsset asset = new MediaAsset();
            asset.setAlbumId(album.getId());
            asset.setOrderId(orderId);
            asset.setAssetType("AI_BASIC");
            asset.setFileUrl(url);
            asset.setPreviewUrl(url);
            asset.setThumbnailUrl(url);
            asset.setMimeType("image/jpeg");
            asset.setStatus(AssetStatus.PROCESSING.getCode());
            mediaAssetMapper.insert(asset);
            assets.add(asset);
        }

        onAiComplete(orderId, assets);
    }

    private String inferCity(String location) {
        if (location == null) {
            return null;
        }
        if (location.contains("台北") || location.contains("臺北") || location.contains("陽明山")) {
            return "臺北市";
        }
        if (location.contains("淡水") || location.contains("九份")) {
            return "新北市";
        }
        return null;
    }

    @Override
    @Transactional
    public void onAiComplete(Long orderId, List<MediaAsset> assets) {
        log.info("AI 調色完成: orderId={}, assets={}", orderId, assets.size());

        // 更新資產狀態為 READY
        for (MediaAsset asset : assets) {
            asset.setStatus(AssetStatus.READY.getCode());
            mediaAssetMapper.updateById(asset);
        }

        // 狀態轉移：AiProcessing → Delivered
        orderService.transition(orderId, OrderStatus.DELIVERED,
                "AI_DELIVERY_COMPLETE", "AI 調色完成，照片已上架", "MEDIA");

        // 通知消費者
        Order order = orderService.getById(orderId);
        notifyService.triggerFlow("photo_delivered", order.getConsumerId(),
                "照片已交付", "您的拍攝照片已完成 AI 調色並上架，請至 App 瀏覽。");
    }

    @Override
    public String getMediaStatus(Long orderId) {
        List<MediaAsset> assets = mediaAssetMapper.selectList(
                new LambdaQueryWrapper<MediaAsset>().eq(MediaAsset::getOrderId, orderId));
        if (assets.isEmpty()) {
            return "NO_ASSETS";
        }
        return assets.get(0).getStatus();
    }

    @Override
    public void intervene(Long orderId, String reason, Long adminUserId) {
        Order order = orderService.getById(orderId);
        if (order == null) {
            throw new ServiceException(ResultCode.ORDER_NOT_FOUND);
        }
        notifyService.triggerFlow("admin_intervene", order.getPhotographerId(),
                "媒體處理介入",
                "訂單 " + order.getOrderNo() + " 已由營運介入處理。原因：" + reason);
        notifyService.triggerFlow("admin_intervene", order.getConsumerId(),
                "照片處理更新",
                "訂單 " + order.getOrderNo() + " 的照片處理已由客服介入，我們會盡快完成交付。");
        log.info("營運介入媒體處理: orderId={}, admin={}, reason={}", orderId, adminUserId, reason);
    }
}