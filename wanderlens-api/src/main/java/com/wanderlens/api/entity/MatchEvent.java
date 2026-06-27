package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("match_event")
public class MatchEvent {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long requestId;
    private String eventType;
    private Long consumerId;
    private Long providerId;
    private String city;
    private Long serviceTypeId;
    private String metadata;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
