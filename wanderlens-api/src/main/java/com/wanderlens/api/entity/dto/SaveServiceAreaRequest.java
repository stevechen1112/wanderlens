package com.wanderlens.api.entity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SaveServiceAreaRequest {

    /** 樹狀根節點（縣市）ID 列表 */
    @NotNull
    private List<Long> rootNodes;

    /** 已勾選的區域 ID（通常為鄉鎮區 leaf） */
    @NotNull
    private List<Long> selectedNodes;
}
