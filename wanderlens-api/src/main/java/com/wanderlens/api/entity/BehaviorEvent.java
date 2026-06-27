package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("behavior_event")
public class BehaviorEvent {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** ALBUM_VIEWED / PHOTO_DOWNLOADED / PHOTO_SHARED 等 */
    private String eventType;

    private Long userId;
    private Long albumId;
    private Long mediaAssetId;

    /** 附加資料（JSON） */
    private String metadata;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}