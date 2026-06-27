package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.*;
import com.wanderlens.api.entity.dto.AddProviderWorkRequest;
import com.wanderlens.api.entity.dto.ProviderPublicProfileDto;
import com.wanderlens.api.entity.dto.ProviderWorksViewDto;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.*;
import com.wanderlens.api.service.ProviderProfileService;
import com.wanderlens.api.service.ProviderRatingService;
import com.wanderlens.api.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderProfileServiceImpl implements ProviderProfileService {

    private final ProviderService providerService;
    private final ProviderRatingService providerRatingService;
    private final ProviderWorksMapper providerWorksMapper;
    private final ProviderFeatureMapper providerFeatureMapper;
    private final ProviderBankMapper providerBankMapper;
    private final ProviderAreaMapper providerAreaMapper;
    private final AreaMapper areaMapper;
    private final ServiceTypeMapper serviceTypeMapper;
    private final FileRepoMapper fileRepoMapper;

    @Override
    public ProviderPublicProfileDto getPublicProfile(String uuid) {
        Provider provider = providerService.findByUuid(uuid);
        Long providerId = provider.getId();

        List<ProviderFeature> features = providerFeatureMapper.selectList(
                new LambdaQueryWrapper<ProviderFeature>()
                        .eq(ProviderFeature::getProviderId, providerId)
                        .eq(ProviderFeature::getEnable, "Y")
                        .orderByAsc(ProviderFeature::getSort));

        return ProviderPublicProfileDto.builder()
                .provider(provider)
                .serviceTypes(resolveServiceTypes(provider.getServiceItem()))
                .serviceAreaNames(resolveServiceAreaNames(providerId))
                .features(features)
                .works(listWorksWithUrls(providerId))
                .ratingSummary(providerRatingService.getSummary(providerId))
                .build();
    }

    @Override
    public List<ProviderWorksViewDto> listWorksWithUrls(Long providerId) {
        List<ProviderWorks> rows = providerWorksMapper.selectList(
                new LambdaQueryWrapper<ProviderWorks>()
                        .eq(ProviderWorks::getProviderId, providerId)
                        .orderByAsc(ProviderWorks::getSortOrder)
                        .orderByAsc(ProviderWorks::getId));
        return rows.stream().map(this::toWorksView).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProviderWorksViewDto addWork(Long providerId, AddProviderWorkRequest request) {
        long count = providerWorksMapper.selectCount(
                new LambdaQueryWrapper<ProviderWorks>().eq(ProviderWorks::getProviderId, providerId));
        if (count >= 50) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "作品集最多 50 張");
        }
        long dup = providerWorksMapper.selectCount(
                new LambdaQueryWrapper<ProviderWorks>()
                        .eq(ProviderWorks::getProviderId, providerId)
                        .eq(ProviderWorks::getFileUuid, request.getFileUuid()));
        if (dup > 0) {
            throw new ServiceException(ResultCode.BAD_REQUEST, "此作品已存在");
        }

        ProviderWorks row = new ProviderWorks();
        row.setProviderId(providerId);
        row.setFileUuid(request.getFileUuid());
        row.setSortOrder((int) count + 1);
        providerWorksMapper.insert(row);
        return toWorksView(row);
    }

    @Override
    @Transactional
    public void deleteWork(Long providerId, Long workId) {
        ProviderWorks row = providerWorksMapper.selectById(workId);
        if (row == null) {
            throw new ServiceException(ResultCode.NOT_FOUND, "作品不存在");
        }
        if (!row.getProviderId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限刪除此作品");
        }
        providerWorksMapper.deleteById(workId);
    }

    @Override
    @Transactional
    public ProviderFeature saveFeature(Long providerId, ProviderFeature body) {
        if (body.getLanguage() == null || body.getLanguage().isBlank()) {
            body.setLanguage("tw");
        }
        if (body.getFeatureTitle() == null || body.getFeatureTitle().isBlank()) {
            body.setFeatureTitle(body.getFeatureType());
        }
        String enable = body.getEnable();
        if (enable == null && body.getId() != null) {
            enable = "Y";
        }
        if (enable == null) {
            enable = "Y";
        }
        body.setEnable(enable);
        body.setProviderId(providerId);

        if (body.getId() != null) {
            ProviderFeature existing = providerFeatureMapper.selectById(body.getId());
            if (existing == null || !existing.getProviderId().equals(providerId)) {
                throw new ServiceException(ResultCode.FORBIDDEN, "無權限編輯此特色");
            }
            providerFeatureMapper.updateById(body);
            return body;
        }

        if (body.getSort() == null) {
            body.setSort(0);
        }
        providerFeatureMapper.insert(body);
        return body;
    }

    @Override
    @Transactional
    public void deleteFeature(Long providerId, Long featureId) {
        ProviderFeature row = providerFeatureMapper.selectById(featureId);
        if (row == null) {
            return;
        }
        if (!row.getProviderId().equals(providerId)) {
            throw new ServiceException(ResultCode.FORBIDDEN, "無權限刪除此特色");
        }
        providerFeatureMapper.deleteById(featureId);
    }

    @Override
    @Transactional
    public ProviderBank saveBank(Long providerId, ProviderBank body) {
        body.setProviderId(providerId);
        ProviderBank existing = providerBankMapper.selectOne(
                new LambdaQueryWrapper<ProviderBank>().eq(ProviderBank::getProviderId, providerId));
        if (existing != null) {
            body.setId(existing.getId());
            providerBankMapper.updateById(body);
            return body;
        }
        providerBankMapper.insert(body);
        return body;
    }

    private ProviderWorksViewDto toWorksView(ProviderWorks row) {
        return ProviderWorksViewDto.builder()
                .id(row.getId())
                .fileUuid(row.getFileUuid())
                .imageUrl(resolveFileUrl(row.getFileUuid()))
                .sortOrder(row.getSortOrder())
                .build();
    }

    private String resolveFileUrl(String fileUuid) {
        if (fileUuid == null || fileUuid.isBlank()) {
            return null;
        }
        FileRepo file = fileRepoMapper.selectOne(
                new LambdaQueryWrapper<FileRepo>().eq(FileRepo::getUuid, fileUuid));
        return file != null ? file.getUrl() : null;
    }

    private List<ServiceType> resolveServiceTypes(String serviceItem) {
        if (serviceItem == null || serviceItem.isBlank()) {
            return List.of();
        }
        List<Long> ids = Arrays.stream(serviceItem.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .filter(s -> s.matches("\\d+"))
                .map(Long::valueOf)
                .collect(Collectors.toList());
        if (ids.isEmpty()) {
            return List.of();
        }
        return serviceTypeMapper.selectList(
                new LambdaQueryWrapper<ServiceType>().in(ServiceType::getId, ids));
    }

    private List<String> resolveServiceAreaNames(Long providerId) {
        List<ProviderArea> rows = providerAreaMapper.selectList(
                new LambdaQueryWrapper<ProviderArea>().eq(ProviderArea::getProviderId, providerId));
        if (rows.isEmpty()) {
            return List.of();
        }
        List<Long> areaIds = rows.stream().map(ProviderArea::getAreaId).distinct().collect(Collectors.toList());
        List<Area> areas = areaMapper.selectList(
                new LambdaQueryWrapper<Area>().in(Area::getId, areaIds));
        List<String> names = new ArrayList<>();
        for (Area area : areas) {
            if (area.getParentId() != null && area.getParentId() > 0) {
                Area parent = areaMapper.selectById(area.getParentId());
                if (parent != null) {
                    names.add(parent.getName() + area.getName());
                } else {
                    names.add(area.getName());
                }
            } else {
                names.add(area.getName());
            }
        }
        return names.stream().distinct().sorted().collect(Collectors.toList());
    }
}
