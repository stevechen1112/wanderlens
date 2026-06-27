package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 供給方作品集 Entity
 * 對應資料表: provider_works
 */
@Data
@TableName("provider_works")
public class ProviderWorks {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long providerId;

    /** 檔案 UUID（對應 file_repo） */
    private String fileUuid;

    /** 排序 */
    private Integer sortOrder;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}