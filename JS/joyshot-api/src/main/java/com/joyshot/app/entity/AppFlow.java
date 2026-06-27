package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 *
 * @TableName app_flow
 */
@TableName(value ="app_flow")
@Data
public class AppFlow implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 流程類型
     */
    private String flowType;

    /**
     * 流程名稱
     */
    private String flowName;

    /**
     * 分類
     */
    private String flowCat;

    /**
     *
     */
    private Integer seq;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    /**
     * 通知人員
     */
    @TableField(exist = false)
    private List<VFlowUser> notifyUser;

    @TableField(exist = false)
    private String[] lineNotifyUserOption;
}
