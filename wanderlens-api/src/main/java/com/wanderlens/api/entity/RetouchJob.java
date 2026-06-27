package com.wanderlens.api.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 精修工單 Entity
 * 對應資料表: retouch_job
 */
@Data
@TableName("retouch_job")
public class RetouchJob {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long orderId;
    private Long consumerId;

    /** 選片清單（JSON：mediaAssetId 陣列） */
    private String mediaAssetIds;

    /** 外包修圖公司 ID（User ID with RETOUCH_COMPANY role） */
    private Long retouchCompanyId;

    /** REQUESTED / ASSIGNED / IN_PROGRESS / DELIVERED / REJECTED / SETTLED */
    private String status;

    /** 修圖規格 */
    private String spec;

    /** 精修費用 */
    private Integer fee;

    /** 交期 */
    private LocalDateTime deliveryDeadline;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime modifiedAt;
}