package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("notify_device_token")
public class NotifyDeviceToken {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String token;
    private String platform;
    private String appType;
    private String deviceId;
    private Boolean active;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
