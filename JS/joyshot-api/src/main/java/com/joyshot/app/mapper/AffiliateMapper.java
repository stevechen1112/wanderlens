package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.entity.Affiliate;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.GroupByDTO;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @author avery
* @description【affiliate】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.Affiliate
*/
public interface AffiliateMapper extends BaseMapper<Affiliate> {

    Page<Affiliate> selectByPage(IPage<Affiliate> page, String queryField, String keyword);

    @Select("Select * from affiliate where id = #{affid}")
    Affiliate getInfoById(Integer affid);

    @Select("Select * from affiliate where go_live = 'Y' and (name like concat('%',#{keyword},'%') or nick_name like concat('%',#{keyword},'%'))")
    List<Affiliate> findByName(String keyword);
}




