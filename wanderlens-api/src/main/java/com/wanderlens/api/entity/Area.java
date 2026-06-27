package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("area")
public class Area {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String nameEn;
    private String nameJp;
    private String nameKr;

    private Long parentId;
    private String imageUuid;
    private Integer minHour;
    private String zipCode;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}