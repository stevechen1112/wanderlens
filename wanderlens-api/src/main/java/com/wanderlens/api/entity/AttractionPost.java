package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("attraction_post")
public class AttractionPost {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String language;
    private String area;
    private String name;
    private String imageUuid;
    private String postUrl;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}