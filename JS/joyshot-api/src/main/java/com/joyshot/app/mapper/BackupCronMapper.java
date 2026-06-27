package com.joyshot.app.mapper;

import com.joyshot.app.entity.BackupCron;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
* @author avery
* @description【backup_cron】的資料庫操作Mapper
* @Entity com.joyshot.app.entity.BackupCron
*/
public interface BackupCronMapper extends BaseMapper<BackupCron> {

    @Select("Select * from backup_cron where backup_done='N' and backup_running='N'")
    List<BackupCron> getBackupNotDone();

    @Update("Update backup_cron set backup_running='Y' where id = #{id} ")
    void setRunninig(Integer id);

    @Update("Update backup_cron set backup_running = 'N', backup_done = 'Y' where order_no = #{orderNo} ")
    void finishBackup(String orderNo);
}




