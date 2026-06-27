package com.wanderlens.api.entity.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class RatingSummaryDto {
    private Double averageRating;
    private Integer totalCount;
    private Map<String, Integer> distribution;
    private List<RatingItemDto> recentRatings;

    @Data
    @Builder
    public static class RatingItemDto {
        private Long id;
        private Integer stars;
        private String comments;
        private String consumerName;
        private String createdAt;
    }
}
