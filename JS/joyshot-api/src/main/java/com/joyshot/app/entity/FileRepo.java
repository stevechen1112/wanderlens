package com.joyshot.app.entity;

import java.io.Serializable;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * @TableName file_repo
 */
@TableName(value ="file_repo")
@Data
public class FileRepo implements Serializable {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 檔名
     */
    private String name;

    /**
     * 類型
     */
    private String type;

    /**
     * 大小
     */
    private Long size;

    /**
     * 下載連結
     */
    private String url;

    /**
     * 是否刪除
     */
    private Boolean isDeleted;

    /**
     * 是否禁用連結
     */
    private Boolean enable;

    /**
     * uuid
     */
    private String uuid;

    /**
     * 實體檔案
     */
    private byte[] fileObj;

    /**
     * 使用在何處
     */
    private String fileUsage;

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


    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    @TableField(exist = false)
    private MultipartFile multipartFile;
}
