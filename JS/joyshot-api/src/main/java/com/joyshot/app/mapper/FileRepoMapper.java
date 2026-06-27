package com.joyshot.app.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.joyshot.app.entity.FileRepo;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

/**
 * @author avery
 * @Entity com.lhdecor.crm.mapper.FileRepo
 */
public interface FileRepoMapper extends BaseMapper<FileRepo> {

    int insertFile(FileRepo fileRepo);

    @Delete("delete from file_repo where uuid = #{fileUuid}")
    void removeByUuid(String fileUuid);

    @Select("select * from file_repo where uuid=#{fileUuid}")
    FileRepo getFileRepoByUuid(String fileUuid);
}




