package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("match_request")
public class MatchRequest {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long consumerId;
    private Long serviceTypeId;
    private Long configurationId;
    private String status;
    private String city;
    private String shootingLocation;
    private Double shootingLat;
    private Double shootingLng;
    private BigDecimal durationHours;
    private LocalDateTime scheduledTime;
    private Integer estimatedFee;
    private Integer radiusKm;
    private Integer broadcastRound;
    private Long matchedProviderId;
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private LocalDateTime expiresAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}
