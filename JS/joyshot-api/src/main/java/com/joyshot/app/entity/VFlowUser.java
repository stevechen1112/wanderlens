package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;

import lombok.Data;

/**
 * @TableName v_flow_user
 */
@TableName(value = "v_flow_user")
@Data
public class VFlowUser implements Serializable {
    /**
     *
     */
    private Integer flowId;

    /**
     *
     */
    private Integer userId;



    /**
     *
     */
    private String empno;

    /**
     *
     */
    private String username;

    /**
     *
     */
    private String lineToken;






    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
