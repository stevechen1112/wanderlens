package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("media_asset")
public class MediaAsset {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long albumId;
    private Long orderId;

    /** RAW / JPEG / AI_BASIC / RETOUCH */
    private String assetType;

    private String fileUrl;
    private String previewUrl;
    private String thumbnailUrl;

    private Long fileSize;
    private String mimeType;

    /** UPLOADING / UPLOADED / PROCESSING / READY / FAILED */
    private String status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}