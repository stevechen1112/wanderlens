package com.wanderlens.api.controller.album;

import com.wanderlens.api.common.Result;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.Consent;
import com.wanderlens.api.entity.MediaAsset;
import com.wanderlens.api.service.AlbumService;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/albums")
@RequiredArgsConstructor
@Tag(name = "Album", description = "相簿與內容")
public class AlbumController {

    private final AlbumService albumService;
    private final AuthUtil authUtil;

    @GetMapping
    @Operation(summary = "我的相簿列表")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Album>> myAlbums(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(albumService.getMyAlbums(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "相簿詳情")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Album> albumDetail(HttpServletRequest request, @PathVariable Long id) {
        Album album = albumService.getAlbumDetail(id);
        if (album == null) {
            return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        }
        // 驗證存取權限：私人相簿僅擁有者/攝影師/管理員可看
        if ("PRIVATE".equals(album.getAlbumType())) {
            Long userId = (Long) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");
            if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)
                    && !userId.equals(album.getConsumerId())
                    && !userId.equals(album.getPhotographerId())) {
                return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限存取此相簿");
            }
        }
        return Result.ok(album);
    }

    @GetMapping("/{id}/photos")
    @Operation(summary = "相簿照片列表")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<MediaAsset>> albumPhotos(HttpServletRequest request, @PathVariable Long id) {
        // 同樣驗證存取權限
        Album album = albumService.getAlbumDetail(id);
        if (album == null) {
            return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        }
        if ("PRIVATE".equals(album.getAlbumType())) {
            Long userId = (Long) request.getAttribute("userId");
            String role = (String) request.getAttribute("role");
            if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)
                    && !userId.equals(album.getConsumerId())
                    && !userId.equals(album.getPhotographerId())) {
                return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限存取此相簿");
            }
        }
        return Result.ok(albumService.getAlbumPhotos(id));
    }

    @PostMapping("/{id}/download")
    @Operation(summary = "下載照片")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> download(HttpServletRequest request,
                                 @PathVariable Long id,
                                 @RequestParam Long mediaAssetId) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        // 驗證存取權限
        Album album = albumService.getAlbumDetail(id);
        if (album == null) return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        if (!"ADMIN".equals(role) && !"SUPPORT".equals(role)
                && !userId.equals(album.getConsumerId())
                && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限下載此相簿照片");
        }
        albumService.downloadPhoto(id, mediaAssetId, userId);
        return Result.ok();
    }

    @PostMapping("/{id}/share")
    @Operation(summary = "產生分享連結")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> share(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        Album album = albumService.getAlbumDetail(id);
        if (album == null) return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限分享此相簿");
        }
        return Result.ok(albumService.generateShareLink(id));
    }

    @PutMapping("/{id}/consent")
    @Operation(summary = "設定授權")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> setConsent(HttpServletRequest request, @PathVariable Long id,
                                   @RequestParam(required = false) String consumerConsent,
                                   @RequestParam(required = false) String providerConsent) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        Album album = albumService.getAlbumDetail(id);
        if (album == null) return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限修改此相簿授權");
        }
        albumService.setConsent(id, consumerConsent, providerConsent);
        return Result.ok();
    }

    @GetMapping("/{id}/consent")
    @Operation(summary = "取得授權設定")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Consent> getConsent(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        Album album = albumService.getAlbumDetail(id);
        if (album == null) return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限查看此相簿授權");
        }
        return Result.ok(albumService.getConsent(id));
    }

    @PostMapping("/{id}/consent/revoke")
    @Operation(summary = "撤回授權")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> revokeConsent(HttpServletRequest request, @PathVariable Long id) {
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        Album album = albumService.getAlbumDetail(id);
        if (album == null) return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限撤回此相簿授權");
        }
        albumService.revokeConsent(id);
        return Result.ok();
    }

    @GetMapping("/public")
    @Operation(summary = "公開相簿（前台）")
    public Result<List<Album>> publicAlbums() {
        return Result.ok(albumService.getPublicAlbums());
    }

    @GetMapping("/location/{location}")
    @Operation(summary = "地點靈感頁（前台）")
    public Result<List<Album>> locationAlbums(@PathVariable String location) {
        return Result.ok(albumService.getAlbumsByLocation(location));
    }

    // ── Phase 3: 內容平台化 ──

    @GetMapping("/history/year/{year}")
    @Operation(summary = "拍攝歷程 — 依年份")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Album>> albumsByYear(HttpServletRequest request, @PathVariable int year) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(albumService.getAlbumsByYear(userId, year));
    }

    @GetMapping("/history/location/{location}")
    @Operation(summary = "拍攝歷程 — 依地點")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Album>> albumsByLocationForUser(HttpServletRequest request, @PathVariable String location) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(albumService.getAlbumsByLocationForUser(userId, location));
    }

    @GetMapping("/history/type/{serviceTypeId}")
    @Operation(summary = "拍攝歷程 — 依拍攝類型")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Album>> albumsByServiceType(HttpServletRequest request, @PathVariable Long serviceTypeId) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(albumService.getAlbumsByServiceType(userId, serviceTypeId));
    }

    @PostMapping("/{id}/favorite")
    @Operation(summary = "收藏照片")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> favorite(HttpServletRequest request,
                                 @PathVariable Long id,
                                 @RequestParam Long mediaAssetId) {
        Long userId = (Long) request.getAttribute("userId");
        albumService.favorite(userId, id, mediaAssetId);
        return Result.ok();
    }

    @DeleteMapping("/{id}/favorite")
    @Operation(summary = "取消收藏")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> unfavorite(HttpServletRequest request,
                                   @PathVariable Long id,
                                   @RequestParam Long mediaAssetId) {
        Long userId = (Long) request.getAttribute("userId");
        albumService.unfavorite(userId, id, mediaAssetId);
        return Result.ok();
    }

    @GetMapping("/favorites")
    @Operation(summary = "收藏列表")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<com.wanderlens.api.entity.AlbumFavorite>> favorites(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.ok(albumService.getFavorites(userId));
    }

    @PutMapping("/{id}/consent/multi")
    @Operation(summary = "多層授權設定（Phase 3）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> setMultiLevelConsent(HttpServletRequest request,
                                             @PathVariable Long id,
                                             @RequestParam(required = false) String consumerConsent,
                                             @RequestParam(required = false) String providerConsent,
                                             @RequestParam(required = false) Boolean hasMinor) {
        // 驗證請求者為相簿擁有者或攝影師或管理員
        Album album = albumService.getAlbumDetail(id);
        if (album == null) {
            return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        }
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限修改此相簿授權");
        }
        albumService.setMultiLevelConsent(id, consumerConsent, providerConsent, hasMinor);
        return Result.ok();
    }

    @PostMapping("/{id}/share/{platform}")
    @Operation(summary = "社群分享連結（IG/FB/LINE）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<String> socialShare(HttpServletRequest request, @PathVariable Long id, @PathVariable String platform) {
        // 驗證請求者為相簿擁有者或攝影師
        Album album = albumService.getAlbumDetail(id);
        if (album == null) {
            return Result.error(ResultCode.ALBUM_NOT_FOUND.getCode(), ResultCode.ALBUM_NOT_FOUND.getMessage());
        }
        Long userId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");
        if (!"ADMIN".equals(role) && !userId.equals(album.getConsumerId()) && !userId.equals(album.getPhotographerId())) {
            return Result.error(ResultCode.FORBIDDEN.getCode(), "無權限分享此相簿");
        }
        return Result.ok(albumService.generateSocialShareLink(id, platform));
    }

    @GetMapping("/public/location/{location}/type/{serviceTypeId}")
    @Operation(summary = "SEO 地點靈感頁 — 依地點 + 類型")
    public Result<List<Album>> publicAlbumsByLocationAndType(@PathVariable String location,
                                                             @PathVariable Long serviceTypeId) {
        return Result.ok(albumService.getPublicAlbumsByLocationAndType(location, serviceTypeId));
    }

    @GetMapping("/public/type/{serviceTypeId}")
    @Operation(summary = "SEO 拍攝類型頁")
    public Result<List<Album>> publicAlbumsByType(@PathVariable Long serviceTypeId) {
        return Result.ok(albumService.getPublicAlbumsByType(serviceTypeId));
    }

    @GetMapping("/public/photographer/{photographerId}")
    @Operation(summary = "攝影師公開作品頁")
    public Result<List<Album>> publicAlbumsByPhotographer(@PathVariable Long photographerId) {
        return Result.ok(albumService.getPublicAlbumsByPhotographer(photographerId));
    }
}