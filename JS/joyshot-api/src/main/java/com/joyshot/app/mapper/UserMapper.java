package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author avery
 * @Entity com.lhdecor.crm.entity.User
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    IPage<User> findPage(IPage<User> page,
                         @Param("queryField") String queryField,
                         @Param("keyword") String keyword);

    User login(User user);

    User selectByUserToken(@Param("token") String token);


    List<User> selectManagerUser();

    List<User> selectSalesUser();

    User selectUserByEmpno(@Param("empno") String empno);

    User selectUserById(@Param("id") Integer id);

    User selectUserWithRole(@Param("id") Integer id);

    @Select("select count(*) count, area col from user where is_deleted = 0 group by area")
    List<GroupByDTO> selectGroupByType();


//    @Update("update user set username=#{nickName} where phone = #{phone} and ph_id = #{phId}")
//    int updateByAccountNo(String phone, String nickName, Integer phId);

    @Select("select * from user where ph_id = #{phId}")
    User selectByPhId(Integer phId);

    int addPhotographerAccount(String phone, String nickName, String password, Integer phId);

    int addAffiliateAccount(String phone, String nickName, String password, Integer uuid, Integer roleId);

    @Update("update user set is_deleted=1 where ph_id = #{phId}")
    void removePhotographer(Integer phId);

    @Update("update user set is_deleted=1 where aff_id = #{affid}")
    void removeAffiliate(Integer affid);

    @Update("update user set username=#{nickName} where ph_id=#{phId}")
    int updateByPhId(String nickName, Integer phId);

    @Update("update user set username=#{nickName} where aff_id=#{affId}")
    int updateByAffId(String nickName, Integer affId);

    List<User> findPhotographer();

    List<User> findManager();

    @Select("select * from user where empno = #{empno}")
    User findByEmpno(String empno);

//    List<User> findActivePhotographer();
}




