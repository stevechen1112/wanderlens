package com.joyshot.app.mapper;

import com.joyshot.app.entity.PhotographerBank;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【photographer_bank】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.PhotographerBank
*/
public interface PhotographerBankMapper extends BaseMapper<PhotographerBank> {

    @Select("Select * from photographer_bank where ph_id = #{pid}")
    PhotographerBank getBankInfo(Integer pid);
}




