package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("scene_tag")
public class SceneTag {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long albumId;
    private Long mediaAssetId;

    /** SERVICE_TYPE / RELATION / LOCATION / SITUATION / STYLE / COMMERCIAL_INTENT */
    private String tagCategory;

    private String tagValue;

    /** ORDER / MAP / USER_INPUT / AI_RECOGNITION / MANUAL / BEHAVIOR */
    private String tagSource;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}