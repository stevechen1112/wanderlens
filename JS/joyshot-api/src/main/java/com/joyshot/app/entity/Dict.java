package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;

import lombok.Data;

/**
 * @TableName dict
 */
@TableName(value = "dict")
@Data
public class Dict implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 名稱
     */
    private String name;

    /**
     * 內容
     */
    private String value;
    private String valueEn;
    private String valueJp;
    private String valueKr;

    /**
     * 類型
     */
    private String type;

    /**
     * 備註
     */
    private String notes;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
