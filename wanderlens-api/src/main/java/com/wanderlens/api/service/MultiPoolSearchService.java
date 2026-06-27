package com.wanderlens.api.service;

import com.wanderlens.api.entity.dto.SearchProviderRequest;
import com.wanderlens.api.entity.dto.SearchProviderResult;
import com.wanderlens.api.entity.dto.MultiPoolSearchResult;

import java.util.List;

public interface MultiPoolSearchService {

    /**
     * 三池媒合引擎
     *
     * 依拍攝配置決定需要哪些供給池：
     * - 外拍 + 單攝影師 → 僅攝影師池
     * - 棚拍 + 單攝影師 → 攝影師池 + 攝影棚池
     * - 外拍 + 單攝影師 + 造型師 → 攝影師池 + 造型師池
     * - 外拍 + 雙攝影師 → 攝影師池（2位）
     * - 外拍 + 棚拍 + 單攝影師 + 造型師 → 三池全交集
     *
     * 回傳各池的可用供給方清單，由消費者分別選擇。
     */
    MultiPoolSearchResult searchMultiPool(SearchProviderRequest request);
}