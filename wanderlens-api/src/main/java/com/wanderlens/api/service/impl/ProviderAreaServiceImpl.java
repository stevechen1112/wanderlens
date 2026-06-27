package com.wanderlens.api.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.common.ResultCode;
import com.wanderlens.api.entity.Area;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.ProviderArea;
import com.wanderlens.api.entity.dto.AreaTreeNodeDto;
import com.wanderlens.api.entity.dto.SaveServiceAreaRequest;
import com.wanderlens.api.entity.dto.ServiceAreaResponse;
import com.wanderlens.api.exception.ServiceException;
import com.wanderlens.api.mapper.AreaMapper;
import com.wanderlens.api.mapper.ProviderAreaMapper;
import com.wanderlens.api.service.ProviderAreaService;
import com.wanderlens.api.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderAreaServiceImpl implements ProviderAreaService {

    private final AreaMapper areaMapper;
    private final ProviderAreaMapper providerAreaMapper;
    private final ProviderService providerService;

    @Override
    public ServiceAreaResponse getServiceArea(Long providerId) {
        Provider provider = providerService.getById(providerId);
        if (provider == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }

        List<Area> roots = loadRootAreas(provider);
        List<AreaTreeNodeDto> rootNodes = new ArrayList<>();
        for (Area root : roots) {
            List<Area> children = areaMapper.selectList(
                    new LambdaQueryWrapper<Area>().eq(Area::getParentId, root.getId()));
            rootNodes.add(toTreeNode(root, children));
        }

        List<Long> selectedNodes = providerAreaMapper.selectList(
                        new LambdaQueryWrapper<ProviderArea>().eq(ProviderArea::getProviderId, providerId))
                .stream()
                .map(ProviderArea::getAreaId)
                .collect(Collectors.toList());

        return new ServiceAreaResponse(rootNodes, selectedNodes);
    }

    @Override
    @Transactional
    public void saveServiceArea(Long providerId, SaveServiceAreaRequest request) {
        Provider provider = providerService.getById(providerId);
        if (provider == null) {
            throw new ServiceException(ResultCode.PROVIDER_NOT_FOUND);
        }

        providerAreaMapper.delete(
                new LambdaQueryWrapper<ProviderArea>().eq(ProviderArea::getProviderId, providerId));

        Set<Long> selected = new HashSet<>(request.getSelectedNodes());
        for (Long rootId : request.getRootNodes()) {
            List<Area> children = areaMapper.selectList(
                    new LambdaQueryWrapper<Area>().eq(Area::getParentId, rootId));
            for (Area child : children) {
                if (!selected.contains(child.getId())) {
                    continue;
                }
                ProviderArea row = new ProviderArea();
                row.setProviderId(providerId);
                row.setAreaParentId(rootId);
                row.setAreaId(child.getId());
                row.setZipCode(child.getZipCode());
                providerAreaMapper.insert(row);
            }
        }
    }

    private List<Area> loadRootAreas(Provider provider) {
        List<Area> allRoots = areaMapper.selectList(
                new LambdaQueryWrapper<Area>()
                        .isNull(Area::getParentId)
                        .or()
                        .eq(Area::getParentId, 0)
                        .orderByAsc(Area::getId));
        if (allRoots.isEmpty()) {
            return allRoots;
        }
        if (provider.getCity() == null || provider.getCity().isBlank()) {
            return allRoots;
        }
        String city = provider.getCity().trim();
        List<Area> matched = allRoots.stream()
                .filter(a -> city.equals(a.getName()) || city.contains(a.getName()) || a.getName().contains(city))
                .collect(Collectors.toList());
        return matched.isEmpty() ? allRoots : matched;
    }

    private AreaTreeNodeDto toTreeNode(Area root, List<Area> children) {
        AreaTreeNodeDto node = new AreaTreeNodeDto();
        node.setId(root.getId());
        node.setName(root.getName());
        node.setMinHour(root.getMinHour());
        node.setTreeName(root.getName());
        node.setChildren(children.stream().map(child -> {
            AreaTreeNodeDto leaf = new AreaTreeNodeDto();
            leaf.setId(child.getId());
            leaf.setName(child.getName());
            leaf.setMinHour(child.getMinHour());
            String label = child.getName();
            if (child.getMinHour() != null && child.getMinHour() > 0) {
                label = child.getName() + "(" + child.getMinHour() + "小時)";
            }
            leaf.setTreeName(label);
            return leaf;
        }).collect(Collectors.toList()));
        return node;
    }
}
