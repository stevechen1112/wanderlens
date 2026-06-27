package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方評價 Entity
 * 對應資料表: provider_rating
 */
@Data
@TableName("provider_rating")
public class ProviderRating {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    /** 訂單 ID */
    private Long orderId;

    /** 評價者姓名 */
    private String author;

    /** 星等（1-5） */
    private Integer stars;

    /** 評價內容 */
    private String comments;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}