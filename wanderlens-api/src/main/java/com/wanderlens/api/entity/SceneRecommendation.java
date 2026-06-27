package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("scene_recommendation")
public class SceneRecommendation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long serviceTypeId;
    private String sceneTag;
    private String partnerName;
    private String title;
    private String description;
    private String imageUrl;
    private String affiliateUrl;
    private BigDecimal commissionRate;
    private Integer priority;
    private String active;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}
