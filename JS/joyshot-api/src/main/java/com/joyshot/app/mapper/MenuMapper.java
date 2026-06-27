package com.joyshot.app.mapper;

import com.joyshot.app.entity.Menu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author avery
 * @description 针对表【lh_menu】的数据库操作Mapper
 * @createDate 2022-04-28 13:59:14
 * @Entity com.lhdecor.crm.entity.Menu
 */
public interface MenuMapper extends BaseMapper<Menu> {

    @Select("Select id from lh_menu where is_deleted = 0")
    List<Integer> selectAllMenuId();

}




