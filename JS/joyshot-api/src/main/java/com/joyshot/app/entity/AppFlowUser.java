package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 *
 * @TableName app_flow_user
 */
@TableName(value ="app_flow_user")
@Data
public class AppFlowUser implements Serializable {
    /**
     * 流程id
     */
    private Integer flowId;

    /**
     * 人員
     */
    private Integer userId;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
