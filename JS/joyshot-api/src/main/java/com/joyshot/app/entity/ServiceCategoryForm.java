package com.joyshot.app.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * @author avery
 */
@Data
public class ServiceCategoryForm implements Serializable {

    private Integer id;
    private Integer createdBy;
    private Integer fileId;

    private Integer langId;
    private String imageUuid;
    private String name;
    private String description;
    private String uploadNew;//是否上傳新圖片


}
