package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("market_signal")
public class MarketSignal {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String sourceCountry;
    private String sourceCity;
    private String signalType;
    private Integer countValue;
    private String metadata;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
