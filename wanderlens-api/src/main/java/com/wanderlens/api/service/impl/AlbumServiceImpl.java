package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.entity.enums.AlbumType;
import com.wanderlens.api.entity.enums.BehaviorEventType;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.*;
import com.wanderlens.api.service.AlbumService;
import com.wanderlens.api.service.PublicIncentiveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlbumServiceImpl extends ServiceImpl<AlbumMapper, Album> implements AlbumService {

    private final MediaAssetMapper mediaAssetMapper;
    private final ConsentMapper consentMapper;
    private final SceneTagMapper sceneTagMapper;
    private final BehaviorEventMapper behaviorEventMapper;
    private final AlbumFavoriteMapper albumFavoriteMapper;
    private final PublicIncentiveService publicIncentiveService;

    @Override
    public List<Album> getMyAlbums(Long consumerId) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getConsumerId, consumerId)
                .orderByDesc(Album::getShootDate));
    }

    @Override
    public Album getAlbumDetail(Long albumId) {
        Album album = getById(albumId);
        if (album == null) {
            throw new ServiceException(ResultCode.ALBUM_NOT_FOUND);
        }
        return album;
    }

    @Override
    public List<MediaAsset> getAlbumPhotos(Long albumId) {
        return mediaAssetMapper.selectList(new LambdaQueryWrapper<MediaAsset>()
                .eq(MediaAsset::getAlbumId, albumId)
                .eq(MediaAsset::getStatus, "READY")
                .orderByAsc(MediaAsset::getCreatedAt));
    }

    @Override
    public String generateShareLink(Long albumId) {
        return "/albums/shared/" + albumId + "?token=" + UUID.randomUUID().toString().substring(0, 8);
    }

    @Override
    @Transactional
    public void downloadPhoto(Long albumId, Long mediaAssetId, Long userId) {
        recordBehavior(BehaviorEventType.PHOTO_DOWNLOADED.getCode(), userId, albumId, mediaAssetId);
    }

    @Override
    @Transactional
    public void setConsent(Long albumId, String consumerConsent, String providerConsent) {
        Consent consent = consentMapper.selectOne(new LambdaQueryWrapper<Consent>()
                .eq(Consent::getAlbumId, albumId));

        if (consent == null) {
            consent = new Consent();
            consent.setAlbumId(albumId);
            consent.setConsentByConsumer(false);
            consent.setConsentByProvider(false);
        }

        if (consumerConsent != null) {
            consent.setConsumerConsent(consumerConsent);
            consent.setConsentByConsumer(true);
        }
        if (providerConsent != null) {
            consent.setProviderConsent(providerConsent);
            consent.setConsentByProvider(true);
        }

        if (consent.getId() != null) {
            consentMapper.updateById(consent);
        } else {
            consentMapper.insert(consent);
        }
    }

    @Override
    @Transactional
    public void revokeConsent(Long albumId) {
        Consent consent = consentMapper.selectOne(new LambdaQueryWrapper<Consent>()
                .eq(Consent::getAlbumId, albumId));
        if (consent != null) {
            consent.setConsentByConsumer(false);
            consent.setConsentByProvider(false);
            consent.setRevokedAt(LocalDateTime.now());
            consentMapper.updateById(consent);
        }

        // ── 同步將 Album 設回 PRIVATE ──
        Album album = getById(albumId);
        if (album != null) {
            album.setAlbumType(AlbumType.PRIVATE.getCode());
            updateById(album);
        }

        log.info("授權已撤回，相簿設為私密: albumId={}", albumId);
    }

    @Override
    public Consent getConsent(Long albumId) {
        return consentMapper.selectOne(new LambdaQueryWrapper<Consent>()
                .eq(Consent::getAlbumId, albumId));
    }

    @Override
    public List<Album> getPublicAlbums() {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getAlbumType, AlbumType.PUBLIC.getCode()));
    }

    @Override
    public List<Album> getAlbumsByLocation(String location) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getAlbumType, AlbumType.PUBLIC.getCode())
                .like(Album::getShootLocation, location));
    }

    @Override
    public void recordBehavior(String eventType, Long userId, Long albumId, Long mediaAssetId) {
        BehaviorEvent event = new BehaviorEvent();
        event.setEventType(eventType);
        event.setUserId(userId);
        event.setAlbumId(albumId);
        event.setMediaAssetId(mediaAssetId);
        behaviorEventMapper.insert(event);
    }

    @Override
    @Transactional
    public void autoGenerateSceneTags(Long albumId, Long serviceTypeId, String city, String location) {
        // 從訂單資料自動產生場景標籤
        SceneTag typeTag = new SceneTag();
        typeTag.setAlbumId(albumId);
        typeTag.setTagCategory("SERVICE_TYPE");
        typeTag.setTagValue(String.valueOf(serviceTypeId));
        typeTag.setTagSource("ORDER");
        sceneTagMapper.insert(typeTag);

        SceneTag cityTag = new SceneTag();
        cityTag.setAlbumId(albumId);
        cityTag.setTagCategory("LOCATION");
        cityTag.setTagValue(city);
        cityTag.setTagSource("ORDER");
        sceneTagMapper.insert(cityTag);

        SceneTag locTag = new SceneTag();
        locTag.setAlbumId(albumId);
        locTag.setTagCategory("LOCATION");
        locTag.setTagValue(location);
        locTag.setTagSource("ORDER");
        sceneTagMapper.insert(locTag);
    }

    // ── Phase 3: 內容平台化 ──

    @Override
    public List<Album> getAlbumsByYear(Long consumerId, int year) {
        java.time.LocalDate yearStart = java.time.LocalDate.of(year, 1, 1);
        java.time.LocalDate yearEnd = java.time.LocalDate.of(year, 12, 31);
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getConsumerId, consumerId)
                .between(Album::getShootDate, yearStart, yearEnd)
                .orderByDesc(Album::getShootDate));
    }

    @Override
    public List<Album> getAlbumsByLocationForUser(Long consumerId, String location) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getConsumerId, consumerId)
                .like(Album::getShootLocation, location)
                .orderByDesc(Album::getShootDate));
    }

    @Override
    public List<Album> getAlbumsByServiceType(Long consumerId, Long serviceTypeId) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getConsumerId, consumerId)
                .eq(Album::getServiceTypeId, serviceTypeId)
                .orderByDesc(Album::getShootDate));
    }

    @Override
    @Transactional
    public void favorite(Long userId, Long albumId, Long mediaAssetId) {
        // 檢查是否已收藏（避免重複）
        Long existing = albumFavoriteMapper.selectCount(new LambdaQueryWrapper<AlbumFavorite>()
                .eq(AlbumFavorite::getUserId, userId)
                .eq(AlbumFavorite::getAlbumId, albumId)
                .eq(AlbumFavorite::getMediaAssetId, mediaAssetId));
        if (existing > 0) {
            return; // 已收藏，靜默返回
        }

        AlbumFavorite fav = new AlbumFavorite();
        fav.setUserId(userId);
        fav.setAlbumId(albumId);
        fav.setMediaAssetId(mediaAssetId);
        albumFavoriteMapper.insert(fav);
        // 修正：收藏記錄為 PHOTO_FAVORITED
        recordBehavior(BehaviorEventType.PHOTO_FAVORITED.getCode(), userId, albumId, mediaAssetId);
    }

    @Override
    @Transactional
    public void unfavorite(Long userId, Long albumId, Long mediaAssetId) {
        albumFavoriteMapper.delete(new LambdaQueryWrapper<AlbumFavorite>()
                .eq(AlbumFavorite::getUserId, userId)
                .eq(AlbumFavorite::getAlbumId, albumId)
                .eq(AlbumFavorite::getMediaAssetId, mediaAssetId));
    }

    @Override
    public List<AlbumFavorite> getFavorites(Long userId) {
        return albumFavoriteMapper.selectList(new LambdaQueryWrapper<AlbumFavorite>()
                .eq(AlbumFavorite::getUserId, userId)
                .orderByDesc(AlbumFavorite::getCreatedAt));
    }

    @Override
    @Transactional
    public void setMultiLevelConsent(Long albumId, String consumerConsent, String providerConsent, Boolean hasMinor) {
        Consent consent = consentMapper.selectOne(new LambdaQueryWrapper<Consent>()
                .eq(Consent::getAlbumId, albumId));

        if (consent == null) {
            consent = new Consent();
            consent.setAlbumId(albumId);
            consent.setConsentByConsumer(false);
            consent.setConsentByProvider(false);
        }

        if (consumerConsent != null) {
            consent.setConsumerConsent(consumerConsent);
            consent.setConsentByConsumer(true);
        }
        if (providerConsent != null) {
            consent.setProviderConsent(providerConsent);
            consent.setConsentByProvider(true);
        }
        if (hasMinor != null) {
            consent.setHasMinor(hasMinor);
            // 未成年人：上限限制（不覆蓋更嚴格的值）
            if (hasMinor) {
                // 消費者授權最高只到 PUBLIC（不允許 MARKETING/COMMERCIAL）
                if (consumerConsent == null || "MARKETING".equals(consumerConsent) || "COMMERCIAL".equals(consumerConsent)) {
                    consent.setConsumerConsent("PUBLIC");
                    consent.setConsentByConsumer(true);
                }
                // 攝影師授權最高只到 PORTFOLIO（不允許 MARKETING/COMMERCIAL）
                if (providerConsent == null || "MARKETING".equals(providerConsent) || "COMMERCIAL".equals(providerConsent)) {
                    consent.setProviderConsent("PORTFOLIO");
                    consent.setConsentByProvider(true);
                }
            }
        }

        if (consent.getId() != null) {
            consentMapper.updateById(consent);
        } else {
            consentMapper.insert(consent);
        }

        // ── 同步更新 Album.albumType ──
        Album album = getById(albumId);
        if (album != null) {
            String effectiveConsent = consent.getConsumerConsent();
            if ("PRIVATE".equals(effectiveConsent) || effectiveConsent == null) {
                album.setAlbumType(AlbumType.PRIVATE.getCode());
            } else {
                album.setAlbumType(AlbumType.PUBLIC.getCode());
            }
            updateById(album);
            if (consumerConsent != null && !"PRIVATE".equals(consumerConsent) && album.getConsumerId() != null) {
                publicIncentiveService.grantPortfolioReward(album.getConsumerId(), albumId);
            }
        }
    }

    @Override
    public String generateSocialShareLink(Long albumId, String platform) {
        String baseUrl = "https://wanderlens.app/albums/" + albumId;
        return switch (platform) {
            case "facebook" -> "https://www.facebook.com/sharer/sharer.php?u=" + baseUrl;
            case "line" -> "https://social-plugins.line.me/lineit/share?url=" + baseUrl;
            case "instagram" -> baseUrl; // Instagram 不支援 web share，回傳直接連結供複製
            default -> baseUrl;
        };
    }

    @Override
    public List<Album> getPublicAlbumsByLocationAndType(String location, Long serviceTypeId) {
        LambdaQueryWrapper<Album> wrapper = new LambdaQueryWrapper<Album>()
                .eq(Album::getAlbumType, AlbumType.PUBLIC.getCode())
                .like(Album::getShootLocation, location);
        if (serviceTypeId != null) {
            wrapper.eq(Album::getServiceTypeId, serviceTypeId);
        }
        return list(wrapper);
    }

    @Override
    public List<Album> getPublicAlbumsByType(Long serviceTypeId) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getAlbumType, AlbumType.PUBLIC.getCode())
                .eq(Album::getServiceTypeId, serviceTypeId));
    }

    @Override
    public List<Album> getPublicAlbumsByPhotographer(Long photographerId) {
        return list(new LambdaQueryWrapper<Album>()
                .eq(Album::getPhotographerId, photographerId)
                .eq(Album::getAlbumType, AlbumType.PUBLIC.getCode())
                .orderByDesc(Album::getShootDate));
    }
}