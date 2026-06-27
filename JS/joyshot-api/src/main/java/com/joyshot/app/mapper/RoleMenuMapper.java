package com.joyshot.app.mapper;

import com.joyshot.app.entity.Menu;
import com.joyshot.app.entity.RoleMenu;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author avery
 * @Entity com.lhdecor.crm.entity.RoleMenu
 */
public interface RoleMenuMapper extends BaseMapper<RoleMenu> {

    @Delete("delete from role_menu where role_id = #{roleId}")
    int deleteByRoleId(@Param("roleId") Integer roleId);

    /**
     * 撈使用者所屬角色的選單
     *
     * @param roleId
     * @return
     */
    @Select("Select menu_id from role_menu where role_id = #{roleId}")
    List<Integer> selectByRoleId(@Param("roleId") Integer roleId);


    List<Menu> selectMenuShortCut(Integer roleId);

    /**
     * 抓使用者所屬角色的選單用
     * @param roleId
     * @return
     */
//    @Select("Select * from lh_role_menu where role_id = #{roleId}")
//    List<RoleMenu> getMenuByRoleId(@Param("roleId") String roleId);
}




