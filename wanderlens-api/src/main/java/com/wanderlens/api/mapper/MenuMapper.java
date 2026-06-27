package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.Menu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface MenuMapper extends BaseMapper<Menu> {

    /**
     * 依角色 ID 取得選單列表
     */
    @Select("SELECT m.* FROM menu m " +
            "INNER JOIN role_menu rm ON m.id = rm.menu_id " +
            "WHERE rm.role_id = #{roleId} " +
            "ORDER BY m.sort_order, m.id")
    List<Menu> selectByRoleId(Long roleId);
}