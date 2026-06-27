package com.wanderlens.api.service;

import com.wanderlens.api.entity.MediaAsset;

import java.util.List;

public interface MediaInterfaceService {

    /**
     * 核發上傳憑證（給 provider 端向 media 服務上傳）
     */
    String issueUploadToken(Long orderId, Long providerId, String assetType);

    /**
     * 接收 media 服務的驗收結果
     */
    void handleVerifyResult(Long orderId, boolean success, int fileCount, long totalSize, String detail);

    /**
     * 接收 media 服務的 AI 處理狀態
     */
    void handleAiStatus(Long orderId, String status, String detail);

    /**
     * AI 完成後觸發相簿上架 + 通知消費者
     */
    void onAiComplete(Long orderId, List<MediaAsset> assets);

    /**
     * 接收 media 服務的 AI 調色完成通知（建立相簿資產並交付）
     */
    void handleAiComplete(Long orderId, List<String> assetUrls);

    /**
     * 取得訂單的媒體處理狀態（給 admin）
     */
    String getMediaStatus(Long orderId);

    /**
     * 營運介入：標記訂單需人工處理並通知攝影師
     */
    void intervene(Long orderId, String reason, Long adminUserId);
}