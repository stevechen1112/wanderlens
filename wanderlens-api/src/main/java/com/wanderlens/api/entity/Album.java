package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("album")
public class Album {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;
    private Long consumerId;
    private Long photographerId;

    private String title;
    private LocalDate shootDate;
    private String shootLocation;
    private String city;
    private Long serviceTypeId;

    /** PRIVATE / PUBLIC */
    private String albumType;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}