package com.joyshot.app.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.BackupCron;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.OrderMapper;
import com.joyshot.app.service.BackupCronService;
import com.joyshot.app.mapper.BackupCronMapper;
import com.joyshot.app.service.LineService;
import com.joyshot.app.service.OrderService;
import com.joyshot.app.util.MailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
* @author avery
* @description【backup_cron】的資料庫操作Service实现
*/
@Service
public class BackupCronServiceImpl extends ServiceImpl<BackupCronMapper, BackupCron>
    implements BackupCronService{

    @Autowired
    private LineService lineService;

    @Autowired
    private BackupCronMapper backupCronMapper;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    MailUtil mailUtil;

    @Value("${email.bcc}")
    private String EMAIL_BCC;

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public void finishBackup(String orderNo) {
        //更新 backup_cron
        backupCronMapper.finishBackup(orderNo);

        //更新 js_order
        orderMapper.finishBackup(orderNo);

        //發email


        // 發line
//        lineService.sendLineNotify(user.getLineToken(), subject + msg);
    }

    private void finishBackupEmail(String orderNo) {
//        mailUtil.sendHtmlEmail("service@joyshot.app",
//                EMAIL_BCC,
//                "【JoyShot 備份結果】",
//                content );
    }


}




