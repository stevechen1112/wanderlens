package com.wanderlens.api.entity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AreaTreeNodeDto {

    private Long id;
    private String name;

    @JsonProperty("minHours")
    private Integer minHour;

    private String treeName;
    private List<AreaTreeNodeDto> children = new ArrayList<>();
}
