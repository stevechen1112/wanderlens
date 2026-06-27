package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProviderWorksViewDto {
    private Long id;
    private String fileUuid;
    private String imageUrl;
    private Integer sortOrder;
}
