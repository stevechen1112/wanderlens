package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 通知流程設定 Entity
 * 對應資料表: app_flow
 * 依 flowType 查詢通知人員，觸發 LINE/Email/SMS
 */
@Data
@TableName("app_flow")
public class AppFlow {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 流程類型（order_created / order_paid / pay_failed / photo_uploaded 等） */
    private String flowType;

    /** 流程名稱 */
    private String flowName;

    /** 流程分類 */
    private String flowCat;

    /** 順序 */
    private Integer seq;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}