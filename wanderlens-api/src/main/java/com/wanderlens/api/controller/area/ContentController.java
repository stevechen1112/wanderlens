package com.wanderlens.api.controller.area;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.Result;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.mapper.*;
import com.wanderlens.api.util.AuthUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Content", description = "區域與內容管理")
public class ContentController {

    private final AreaMapper areaMapper;
    private final BannerMapper bannerMapper;
    private final NewsMapper newsMapper;
    private final FaqMapper faqMapper;
    private final AttractionPostMapper attractionMapper;
    private final InstagramPostMapper instagramMapper;
    private final FileRepoMapper fileRepoMapper;
    private final com.wanderlens.api.service.LocalFileStorageService fileStorageService;
    private final AuthUtil authUtil;

    /**
     * 驗證後台寫入權限（ADMIN/SUPPORT/EDITOR）
     */
    private void requireWritePermission(HttpServletRequest request) {
        authUtil.requireRole(request, "ADMIN", "SUPPORT", "EDITOR");
    }

    // ── 區域 ──

    @GetMapping("/areas/tree")
    @Operation(summary = "區域樹（前台）")
    public Result<List<Area>> areaTree() {
        return Result.ok(areaMapper.selectList(null));
    }

    @GetMapping("/areas")
    @Operation(summary = "區域列表（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Area>> areaList() {
        return Result.ok(areaMapper.selectList(null));
    }

    @PostMapping("/areas")
    @Operation(summary = "建立/更新區域（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Area> saveArea(HttpServletRequest request, @RequestBody Area area) {
        requireWritePermission(request);
        areaMapper.insertOrUpdate(area);
        return Result.ok(area);
    }

    @DeleteMapping("/areas/{id}")
    @Operation(summary = "刪除區域（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteArea(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        areaMapper.deleteById(id);
        return Result.ok();
    }

    // ── Banner ──

    @GetMapping("/banners/type/{type}")
    @Operation(summary = "Banner（前台）")
    public Result<List<Banner>> bannersByType(@PathVariable String type) {
        return Result.ok(bannerMapper.selectList(new LambdaQueryWrapper<Banner>()
                .eq(Banner::getImageUsage, type)
                .eq(Banner::getActive, "Y")));
    }

    @GetMapping("/banners")
    @Operation(summary = "Banner 列表（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<Banner>> bannerList() {
        return Result.ok(bannerMapper.selectList(null));
    }

    @PostMapping("/banners")
    @Operation(summary = "建立/更新 Banner（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Banner> saveBanner(HttpServletRequest request, @RequestBody Banner banner) {
        requireWritePermission(request);
        bannerMapper.insertOrUpdate(banner);
        return Result.ok(banner);
    }

    @DeleteMapping("/banners/{id}")
    @Operation(summary = "刪除 Banner（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteBanner(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        bannerMapper.deleteById(id);
        return Result.ok();
    }

    // ── News ──

    @GetMapping("/news/on")
    @Operation(summary = "公告（前台）")
    public Result<List<News>> newsOn() {
        return Result.ok(newsMapper.selectList(new LambdaQueryWrapper<News>()
                .eq(News::getStatus, "on")));
    }

    @GetMapping("/news")
    @Operation(summary = "公告列表（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<List<News>> newsList() {
        return Result.ok(newsMapper.selectList(null));
    }

    @PostMapping("/news")
    @Operation(summary = "建立/更新公告（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<News> saveNews(HttpServletRequest request, @RequestBody News news) {
        requireWritePermission(request);
        newsMapper.insertOrUpdate(news);
        return Result.ok(news);
    }

    @DeleteMapping("/news/{id}")
    @Operation(summary = "刪除公告（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteNews(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        newsMapper.deleteById(id);
        return Result.ok();
    }

    // ── FAQ ──

    @GetMapping("/faqs")
    @Operation(summary = "FAQ（前台）")
    public Result<List<Faq>> faqList() {
        return Result.ok(faqMapper.selectList(null));
    }

    @PostMapping("/faqs")
    @Operation(summary = "建立/更新 FAQ（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Faq> saveFaq(HttpServletRequest request, @RequestBody Faq faq) {
        requireWritePermission(request);
        faqMapper.insertOrUpdate(faq);
        return Result.ok(faq);
    }

    @DeleteMapping("/faqs/{id}")
    @Operation(summary = "刪除 FAQ（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteFaq(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        faqMapper.deleteById(id);
        return Result.ok();
    }

    // ── 景點 ──

    @GetMapping("/attractions")
    @Operation(summary = "景點列表（前台）")
    public Result<List<AttractionPost>> attractionList() {
        return Result.ok(attractionMapper.selectList(null));
    }

    @PostMapping("/attractions")
    @Operation(summary = "建立/更新景點（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<AttractionPost> saveAttraction(HttpServletRequest request, @RequestBody AttractionPost attraction) {
        requireWritePermission(request);
        attractionMapper.insertOrUpdate(attraction);
        return Result.ok(attraction);
    }

    @DeleteMapping("/attractions/{id}")
    @Operation(summary = "刪除景點（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteAttraction(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        attractionMapper.deleteById(id);
        return Result.ok();
    }

    // ── IG ──

    @GetMapping("/instagram")
    @Operation(summary = "IG 貼文列表（前台）")
    public Result<List<InstagramPost>> instagramList() {
        return Result.ok(instagramMapper.selectList(null));
    }

    @PostMapping("/instagram")
    @Operation(summary = "建立/更新 IG 貼文（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<InstagramPost> saveInstagram(HttpServletRequest request, @RequestBody InstagramPost post) {
        requireWritePermission(request);
        instagramMapper.insertOrUpdate(post);
        return Result.ok(post);
    }

    @DeleteMapping("/instagram/{id}")
    @Operation(summary = "刪除 IG 貼文（後台）")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<Void> deleteInstagram(HttpServletRequest request, @PathVariable Long id) {
        requireWritePermission(request);
        instagramMapper.deleteById(id);
        return Result.ok();
    }

    // ── 通用檔案上傳 ──

    @PostMapping("/files/upload/{usage}")
    @Operation(summary = "通用檔案上傳")
    @SecurityRequirement(name = "Bearer Authentication")
    public Result<FileRepo> uploadFile(HttpServletRequest request,
                                       @PathVariable String usage,
                                       @RequestParam("file") MultipartFile file) throws IOException {
        requireWritePermission(request);
        String uuid = UUID.randomUUID().toString();

        String url = fileStorageService.store(usage, uuid, file);

        FileRepo fileRepo = new FileRepo();
        fileRepo.setName(file.getOriginalFilename());
        fileRepo.setType(file.getContentType());
        fileRepo.setSize(file.getSize());
        fileRepo.setUrl(url);
        fileRepo.setUuid(uuid);
        fileRepo.setFileUsage(usage);
        fileRepoMapper.insert(fileRepo);

        return Result.ok(fileRepo);
    }

    @GetMapping("/files/{uuid}")
    @Operation(summary = "檔案顯示")
    public Result<FileRepo> getFile(@PathVariable String uuid) {
        return Result.ok(fileRepoMapper.selectOne(new LambdaQueryWrapper<FileRepo>()
                .eq(FileRepo::getUuid, uuid)));
    }
}