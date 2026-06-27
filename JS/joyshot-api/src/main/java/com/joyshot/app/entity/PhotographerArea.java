package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 *
 * @TableName photographer_area
 */
@TableName(value ="photographer_area")
@Data
public class PhotographerArea implements Serializable {
    /**
     * 攝影師id
     */
    private Integer phId;

    /**
     * 主區域id
     */
    private Integer areaParentId;

    /**
     * 負責區域id
     */
    private Integer areaId;

    /**
     * 郵遞區號
     */
    private String zipCode;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
