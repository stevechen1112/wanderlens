package com.wanderlens.api.service;

import com.wanderlens.api.entity.AlbumFavorite;
import com.baomidou.mybatisplus.extension.service.IService;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.BehaviorEvent;
import com.wanderlens.api.entity.Consent;
import com.wanderlens.api.entity.MediaAsset;
import com.wanderlens.api.entity.SceneTag;

import java.util.List;

public interface AlbumService extends IService<Album> {

    List<Album> getMyAlbums(Long consumerId);

    Album getAlbumDetail(Long albumId);

    List<MediaAsset> getAlbumPhotos(Long albumId);

    String generateShareLink(Long albumId);

    void downloadPhoto(Long albumId, Long mediaAssetId, Long userId);

    void setConsent(Long albumId, String consumerConsent, String providerConsent);

    void revokeConsent(Long albumId);

    Consent getConsent(Long albumId);

    List<Album> getPublicAlbums();

    List<Album> getAlbumsByLocation(String location);

    void recordBehavior(String eventType, Long userId, Long albumId, Long mediaAssetId);

    void autoGenerateSceneTags(Long albumId, Long serviceTypeId, String city, String location);

    // ── Phase 3: 內容平台化 ──

    /**
     * 拍攝歷程 — 依年份查詢
     */
    List<Album> getAlbumsByYear(Long consumerId, int year);

    /**
     * 拍攝歷程 — 依地點查詢
     */
    List<Album> getAlbumsByLocationForUser(Long consumerId, String location);

    /**
     * 拍攝歷程 — 依拍攝類型查詢
     */
    List<Album> getAlbumsByServiceType(Long consumerId, Long serviceTypeId);

    /**
     * 收藏照片
     */
    void favorite(Long userId, Long albumId, Long mediaAssetId);

    /**
     * 取消收藏
     */
    void unfavorite(Long userId, Long albumId, Long mediaAssetId);

    /**
     * 取得收藏列表
     */
    List<AlbumFavorite> getFavorites(Long userId);

    /**
     * 多層授權設定（Phase 3 擴展）
     */
    void setMultiLevelConsent(Long albumId, String consumerConsent, String providerConsent, Boolean hasMinor);

    /**
     * 產生社群格式分享（IG/FB/LINE）
     */
    String generateSocialShareLink(Long albumId, String platform);

    /**
     * 依地點 + 拍攝類型查詢公開相簿（SEO 地點靈感頁）
     */
    List<Album> getPublicAlbumsByLocationAndType(String location, Long serviceTypeId);

    /**
     * 依拍攝類型查詢公開相簿（SEO 拍攝類型頁）
     */
    List<Album> getPublicAlbumsByType(Long serviceTypeId);

    /**
     * 攝影師公開作品頁
     */
    List<Album> getPublicAlbumsByPhotographer(Long photographerId);
}