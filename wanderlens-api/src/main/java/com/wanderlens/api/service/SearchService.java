package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SearchProviderResult;

import java.util.List;

public interface SearchService {

    /**
     * 依條件搜尋可用攝影師（階段一僅單池）
     */
    List<SearchProviderResult> searchProviders(SearchProviderRequest request);
}