package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName photographer_bank
 */
@TableName(value ="photographer_bank")
@Data
public class PhotographerBank implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 攝影師
     */
    private Integer phId;

    /**
     * 銀行代碼
     */
    private String bankCode;

    /**
     * 銀行
     */
    private String bank;

    /**
     * 銀行分行
     */
    private String bankBranch;

    /**
     * 戶名
     */
    private String name;

    /**
     * 帳號
     */
    private String account;

    /**
     * 備註
     */
    private String notes;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}