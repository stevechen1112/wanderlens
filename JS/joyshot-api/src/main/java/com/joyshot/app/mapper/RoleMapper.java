package com.joyshot.app.mapper;

import com.joyshot.app.entity.Role;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * @author avery
 * @Entity com.lhdecor.crm.entity.Role
 */
public interface RoleMapper extends BaseMapper<Role> {

    Role selectRoleById(@Param("id") Integer id);

    @Select("Select * from role where name = #{name}")
    Role selectRoleByName(String name);
}




