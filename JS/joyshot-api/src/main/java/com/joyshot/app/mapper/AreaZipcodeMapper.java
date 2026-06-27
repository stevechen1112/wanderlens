package com.joyshot.app.mapper;

import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.AreaZipcode;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【area_zipcode】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.AreaZipcode
*/
public interface AreaZipcodeMapper extends BaseMapper<AreaZipcode> {

    @Select("Select * from area_zipcode where zipcode = #{zipcode} limit 1")
    AreaZipcode findAreaZipcode(String zipcode);
}




