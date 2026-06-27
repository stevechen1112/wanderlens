package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 * 
 * @TableName area_zipcode
 */
@TableName(value ="area_zipcode")
@Data
public class AreaZipcode implements Serializable {
    /**
     * 
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 
     */
    private String zipcode;

    /**
     * 縣市
     */
    private String city;

    /**
     * 鄉鎮區
     */
    private String cityArea;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}