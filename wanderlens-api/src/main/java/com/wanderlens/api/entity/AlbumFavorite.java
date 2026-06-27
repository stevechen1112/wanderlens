package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 相簿收藏 Entity
 * 對應資料表: album_favorite
 */
@Data
@TableName("album_favorite")
public class AlbumFavorite {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long albumId;
    private Long mediaAssetId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}