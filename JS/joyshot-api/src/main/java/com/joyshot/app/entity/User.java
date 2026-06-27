package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.*;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

/**
 * @TableName user
 */
@TableName(value = "user")
@Data
public class User implements Serializable {
    /**
     * ID
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 工號
     */
    private String empno;

    /**
     * 密碼
     */
    private String password;

    /**
     * 姓名
     */
    private String username;


    /**
     * 電話
     */
    private String phone;

    /**
     * 大頭照
     */
    private String avatar;

    private String token;

    /**
     * 所在區域
     */
    private String area;

    /**
     * 角色
     */
    private Integer roleId;

    /**
     * 是否有效
     */
    @TableLogic
    @JsonIgnore
    private Integer isDeleted;

    /**
     * 資料建立時間
     */
    @JsonIgnore
    private Date createdAt;

    /**
     * 資料近期更新時間
     */
    @JsonIgnore
    private Date updatedAt;

    /**
     * line授權碼
     */
    private String lineAuthCode;

    /**
     * line token
     */
    private String lineToken;


    /**
     * 攝影師id
     */
    private Integer phId;

    /**
     * 推廣員id
     */
    private Integer affId;



    private Integer deletePermission;





    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private Role role;

    @TableField(exist = false)
    List<Menu> userMenus;

    @TableField(exist = false)
    private String email;

}
