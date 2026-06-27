package com.wanderlens.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wanderlens.api.entity.RoleMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Delete;

@Mapper
public interface RoleMenuMapper extends BaseMapper<RoleMenu> {

    /**
     * 依角色 ID 刪除所有關聯
     */
    @Delete("DELETE FROM role_menu WHERE role_id = #{roleId}")
    int deleteByRoleId(Long roleId);
}