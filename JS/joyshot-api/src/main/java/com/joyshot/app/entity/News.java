package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName news
 */
@TableName(value ="news")
@Data
public class News implements Serializable {
    /**
     * ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 語系
     */
    private String language;

    /**
     * 最新消息
     */
    private String topic;

    /**
     * 狀態
     */
    private String status;

    public boolean isStatusOn(){
        return "on".equals(status)? true: false;
    }

    /**
     * 建立時間
     */
    private Date createdAt;

    /**
     * 修改時間
     */
    private Date modifiedAt;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
