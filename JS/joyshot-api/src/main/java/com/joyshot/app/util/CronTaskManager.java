package com.joyshot.app.util;

import com.joyshot.app.JoyShotApplication;
import com.joyshot.app.entity.NotifyMessage;
import com.joyshot.app.entity.Order;
import com.joyshot.app.entity.Photographer;
import com.joyshot.app.entity.User;
import com.joyshot.app.mapper.NotifyMessageMapper;
import com.joyshot.app.mapper.OrderMapper;
import com.joyshot.app.mapper.UserMapper;
import com.joyshot.app.service.LineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

/**
 * @author avery
 * Cron :
 * 秒 分 時 日 月 周 (年): 年是可選參數
 */

@Component
public class CronTaskManager {

    Logger logger = LoggerFactory.getLogger(JoyShotApplication.class);

    @Autowired
    private CronTask cronTask;


    /**
     * 每天整點的1分: 拍攝前24H，提醒攝影師
     */
    @Scheduled(cron = "0 1 0/1 * * *")
    public void execTask01() {
        cronTask.remindPhotographer();
    }

    /**
     * 每天整點的5分: 拍攝後6HR，提醒攝影師上傳照片
     */
    @Scheduled(cron = "0 5 0/1 * * *")
    public void execTask02() throws ParseException {
        cronTask.remindPhotoUpload();
    }

    /**
     * 每天整點的10分: 預定後，但三個小時尚未付款的
     */
    @Scheduled(cron = "0 10 0/1 * * *")
    public void execTask03() {
        cronTask.remindNotPaid();
    }

    /**
     * 每天整點的15分: 預定後，但24小尚未付款的，取消訂單，並釋出攝影師的時段
     */
    @Scheduled(cron = "0 10 0/1 * * *")
    public void execTask04() {
        cronTask.releaseSchedule();
    }

    /**
     * 提醒攝影師尚未與客戶聯繫
     * 執行時間:每天 09:00~21:00 間，每個小時的第10分鐘
     */
    @Scheduled(cron = "0 10 9-21 * * *")
//    @Scheduled(cron = "0 10,40 0/1 * * *")
    public void execTask05(){
        cronTask.notifyNotContactCustomer();
    }

    /**
     * 關帳
     * 執行時間:每月4,14,24號 10:00
     */
    @Scheduled(cron = "0 0 10 4,14,24 * *")
    public void execTask06(){
        cronTask.prepareBilling();
    }


    /**
     * 超過24小時未付款訂單，解除訂單，解開攝影師時段
     * 執行時間:每天整點的20分
     */
    @Scheduled(cron = "0 20 0/1 * * *")
    public void execTask07() {
        cronTask.cancelProcessingOrder();
    }


    /**
     * 通知攝影師更新行事曆
     * 執行時間:每月1日 12:00
     */
    @Scheduled(cron = "0 0 12 1 * *")
    public void execTask08() {
        cronTask.notifyPhotographerToUpdateSchedule();
    }

    /**
     * 照片備份
     * 執行時間:每天整點的40分
     */
    @Scheduled(cron = "0 40 0/1 * * *")
    public void execTask09() {
        System.out.println("每天整點的40分照片備份");
//        cronTask.startBackupCron();
    }

    /**
     * 拍攝後18小時尚未完成上的，通知js
     * 執行時間:每天整點的50分
     */
    @Scheduled(cron = "0 50 0/1 * * *")
    public void execTask10() {
        cronTask.notifyTeamThePhotoNotUpload();
    }

    /**
     * 告知攝影師近兩週的行事曆
     * 執行時間:每月1日、15日 13:00
     */
    @Scheduled(cron = "0 0 13 1,15 * *")
//    @Scheduled(cron = "0 59 0 1,14 * *")
    public void execTask11() {
        cronTask.notifyPhotographerScheduleInTwoWeeks();
    }
}
