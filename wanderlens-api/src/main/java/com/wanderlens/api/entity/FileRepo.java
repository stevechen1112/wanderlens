package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("file_repo")
public class FileRepo {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String type;
    private Long size;
    private String url;
    private String uuid;
    private String fileUsage;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}