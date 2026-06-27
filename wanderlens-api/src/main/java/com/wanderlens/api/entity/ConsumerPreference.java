package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("consumer_preference")
public class ConsumerPreference {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String preferredServiceTypeIds;
    private String preferredCities;
    private Integer budgetMin;
    private Integer budgetMax;
    private Boolean pushRecallEnabled;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}
