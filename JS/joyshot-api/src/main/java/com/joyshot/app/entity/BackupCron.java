package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName backup_cron
 */
@TableName(value ="backup_cron")
@Data
public class BackupCron implements Serializable {
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
     * 照片數
     */
    private Integer picNum;

    /**
     * 是否完成備份
     */
    private String backupDone;

    /**
     * 是否正在備份
     */
    private String backupRunning;

    /**
     * 建立時間
     */
    @TableField(fill = FieldFill.INSERT)
    private Date createdAt;

    /**
     * 修改時間
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
