package com.joyshot.app.service;

import com.joyshot.app.entity.BackupCron;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author avery
* @description【backup_cron】的資料庫操作Service
*/
public interface BackupCronService extends IService<BackupCron> {

    void finishBackup(String orderNo);
}
