package com.joyshot.app.entity;

import lombok.Data;

import java.io.Serializable;

/**
 * 負責收集前端查詢表單
 * @author avery
 */
@Data
public class PhotographerSearchForm implements Serializable {

    private Integer adults;
    private boolean checkPets;

    private Integer children;

    private String city_area; //區
    private String city; //縣市

    private String petsNote;

    private String query_date;
    private Double query_duration;
    private Integer query_hour;
    private Integer query_minute;
    private String query_location; //地點名(地址)

    private String query_placeId;
    private String query_placeName; //地點名
    private Integer query_service; //所選服務

    private String query_assign_photographer; //指定攝影師
    private String query_assign_ph_uuid; //指定攝影師

    private Double lat;
    private Double lng;

    private String query_zipcode;

    //拍攝開始時間
    public Integer getMinValue() {
        return query_hour * 60 + query_minute;
    }
    //拍攝結束時間
    public Integer getMaxValue() {
        return getMinValue() + (int)(query_duration * 60);
    }
    //人數
    public Integer getPersons() {
        if (adults == -1)  {adults = 0; };
        if (children == -1) {children = 0;};
        return adults + children;
    }
    public Integer getPetsStatus(){
        return isCheckPets()? 1:0;
    }


    public Integer areaParentId;
    public Integer areaId;
}
