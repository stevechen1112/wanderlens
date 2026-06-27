package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName js_order_history
 */
@TableName(value ="js_order_history")
@Data
public class OrderHistory implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 訂單編號
     */
    private String orderNo;

    /**
     * 操作
     */
    private String orderAction;

    /**
     * 紀錄
     */
    private String actionDetail;

    /**
     * 操作人員
     */
    private String execBy;

    /**
     * 更變備註
     */
    private String updateNotes;

    /**
     * 執行時間
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
