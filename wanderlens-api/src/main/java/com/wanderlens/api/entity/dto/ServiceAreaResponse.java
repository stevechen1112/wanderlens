package com.wanderlens.api.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceAreaResponse {

    private List<AreaTreeNodeDto> rootNodes = new ArrayList<>();
    private List<Long> selectedNodes = new ArrayList<>();
}
