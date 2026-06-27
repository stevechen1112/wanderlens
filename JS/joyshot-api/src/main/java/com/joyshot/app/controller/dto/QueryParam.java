package com.joyshot.app.controller.dto;

import lombok.Data;

/**
 * @author avery
 */
@Data
public class QueryParam {

    private Integer pageNum;
    private Integer pageSize;
    private String queryField;
    private String keyword;
    private String userId;

}
