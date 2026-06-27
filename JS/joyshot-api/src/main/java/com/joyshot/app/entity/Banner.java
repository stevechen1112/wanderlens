package com.joyshot.app.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.io.Serializable;
import lombok.Data;

/**
 *
 * @TableName banner
 */
@TableName(value ="banner")
@Data
public class Banner implements Serializable {
    /**
     *
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 語系
     */
    private String language;

    /**
     * 圖片
     */
    private String imageUuid;

    /**
     * 用途
     */
    private String imageUsage;

    /**
     * 備註
     */
    private String notes;

    private String active;

    public boolean isActiveOn(){
        return "Y".equals(active);
    }



    @TableField(exist = false)
    private FileRepo imageFile;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}
