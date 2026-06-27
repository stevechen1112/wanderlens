package com.joyshot.app.mapper;

import com.joyshot.app.entity.Banner;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import java.util.List;

/**
* @author avery
* @description【banner】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Banner
*/
public interface BannerMapper extends BaseMapper<Banner> {

    List<Banner> findByType(String imageUsage, String lang);

    @Update("update banner set active = #{active} where id = #{id}")
    boolean saveActiveStatus(Integer id, String active);

}
