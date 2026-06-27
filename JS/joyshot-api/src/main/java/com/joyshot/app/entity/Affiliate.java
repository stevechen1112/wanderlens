package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 *
 * @TableName affiliate
 */
@TableName(value ="affiliate")
@Data
public class Affiliate implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 攝影師id，前後台使用
     */
    private String uuid;

    /**
     * 藝名
     */
    private String nickName;

    /**
     * 姓名
     */
    private String name;

    /**
     * 聯絡電話
     */
    private String phone;

    /**
     * email
     */
    private String email;

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

    /**
     * 銀行代碼
     */
    private String bankCode;

    /**
     * 銀行
     */
    private String bankName;

    /**
     * 分行
     */
    private String bankBranch;

    /**
     * 戶名
     */
    private String bankAccountName;

    /**
     * 銀行帳號
     */
    private String bankAccountNo;

    /**
     * 銀行備註
     */
    private String bankNotes;


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
