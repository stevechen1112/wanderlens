package com.joyshot.app.mapper;

import com.joyshot.app.entity.Dict;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.GroupByDTO;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author avery
 * @Entity com.lhdecor.crm.entity.Dict
 */
public interface DictMapper extends BaseMapper<Dict> {

    Dict selectByDictId(@Param("payType") Integer payType);

    @Select("select count(*) count, type col from dict group by type")
    List<GroupByDTO> selectGroupByType();

    @Select("select *  from dict where type=#{type}")
    List<Dict> selectByType(@Param("type") String type);

    @Select("select * from dict where type='item_view'")
    Dict selectItemView();

    @Select("select value from dict where name='subsidy_km'")
    String selectKmSubsidy();

    @Select("select value from dict where name='subsidy_oncustomer'")
    String selectPercentSubsidy();

    @Select("select value from dict where name='unit_price'")
    String selectUnitPrice();

    @Select("select value from dict where name='pay_for_photograapher'")
    String selectPayForPhotographer();

    @Select("select value from dict where name='rating_form'")
    String selectRatingForm();

}




