package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * @TableName area
 */
@TableName(value = "area")
@Data
public class Area implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 區域名
     */
    private String name;
    private String nameEn;
    private String nameJp;
    private String nameKr;

    /**
     * 區域描述
     */
    private String description;

    /**
     * 父區域
     */
    private Integer parentId;

    /**
     * 代表圖
     */
    private String imageUuid;

    /**
     * 最低拍攝時數
     */
    private Integer minHour;

    /**
     * 最低拍攝時數
     */
    private String areaGroup;

    /**
     * 郵遞區號
     */
    private String zipCode;


    public String getTreeName(){
        return parentId == null? name: name + "(" + minHour + "小時)";
    }

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private List<Area> children;
}
