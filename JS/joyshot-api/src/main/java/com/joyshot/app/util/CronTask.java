package com.joyshot.app.util;

import com.joyshot.app.entity.*;
import com.joyshot.app.mapper.*;
import com.joyshot.app.service.LineService;
import com.joyshot.app.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author avery
 */
@Service
public class CronTask {
    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderService orderService;

    @Autowired
    private NotifyMessageMapper notifyMessageMapper;

    @Autowired
    private LineService lineService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BackupCronMapper backupCronMapper;

    @Autowired
    private GdriverUtil gdriverUtil;

    @Autowired
    private MailUtil mailUtil;

    @Value("${email.bcc}")
    private String EMAIL_BCC;

    @Autowired
    private PhotographerScheduleMapper photographerScheduleMapper;


    private DateTimeFormatter pattern = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");


    public void remindPhotographer() {
        System.out.println("每天整點的1分: 拍攝前24H，提醒攝影師:" + new Date());

        //找出24小時後要拍攝的單
        String subject = "【JoyShot 預約服務提醒通知】\n";
        String separate = "\n";

        LocalDateTime now = LocalDateTime.from(new Date().toInstant().atZone(ZoneId.of("UTC+8")));
        String startDate = now.plusDays(1).format(pattern);
        String endDate = now.plusDays(1).plusHours(1).format(pattern);

        List<Order> orders = orderMapper.findShootingDateTime24HourLater(startDate, endDate);
        for (Order order : orders) {
            Photographer photographer = order.getPhotographer();
            User user = userMapper.selectByPhId(photographer.getId());

            String msg = photographer.getNickName() + "攝影師，明日將有一場預約服務！\n";
            msg += "訂單編號：" + order.getOrderNo() + separate;
            msg += "客戶名稱：" + order.getCustomerName() + separate;
            msg += "聯繫電話：" + order.getCustomerPhone() + separate;
            msg += "拍攝類型：" + order.getServiceCat() + separate;
            msg += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + separate;
            msg += "時數：" + order.getShootingDuration() + separate;
            msg += "人數：" + order.getShootingPersons() + separate;
            msg += "拍攝地點：" + order.getShootingLocation() + separate;
            msg += "＊備註：" + order.getExtraInfo() + separate + separate;
            msg += "請注意：" + separate;
            msg += "1. 請於服務開始前24Ｈ內聯繫客戶確認最後需求。" + separate;
//            msg += "2. 請於預約時間以前抵達。並佩戴識別證，以利客戶辨識。" + separate;
            msg += "2. 請於預約時間以前抵達。自我介紹，告知是JOYSHOT合作攝影師。" + separate;
            msg += "3. 請於接洽到客戶準備拍攝前，回報於JoyShot官方LINE。" + separate;
            msg += "4. 若拍攝時間需要延長或有其他狀況，請於當下回報於JoyShot官方LINE。" + separate;
            msg += "5. 請於拍攝完畢時，回報於JoyShot官方LINE。" + separate;
            msg += "6. 服務所提供之拍攝照片數量為 40張/小時為基本數量，請務必符合，若有狀況無法符合此標準，請於當下回報。";
            lineService.sendLineNotify(user.getLineToken(), subject + msg);
        }
    }

    public void remindPhotoUpload() throws ParseException {
        System.out.println("每天整點的5分: 拍攝後12HR，提醒攝影師上傳照片:" + new Date());

        //找出24小時後要拍攝的單
        String subject = "【JoyShot 拍攝服務結束通知】\n\n";
        String separate = "\n";

        LocalDateTime now = LocalDateTime.from(new Date().toInstant().atZone(ZoneId.of("UTC+8")));
        String startDate = now.minusHours(13).format(pattern);
        String endDate = now.minusHours(12).format(pattern);
        List<Order> orders = orderMapper.findShootingDateTimeAfter12Hour(startDate, endDate);
        for (Order order : orders) {
            User user = userMapper.selectByPhId(order.getPhotographer().getId());
            String msg = order.getPhotographer().getNickName() + " 攝影師，今天拍攝辛苦了！\n\n";
            msg += "訂單編號：" + order.getOrderNo() + separate;
            msg += "提醒您，請於拍攝結束後24小時內，將照片整理篩選後，上傳照片並通報，經審核確認後，即完成本次訂單。" + separate;
            msg += "本次服務費與交通補貼費用將會一併於 " + order.getPayDate() + " 日匯入您系統登記之帳戶"+ separate;
            msg += "感謝您對 JoyShot 的支持！";
            lineService.sendLineNotify(user.getLineToken(), subject + msg);
        }
    }

    public void remindNotPaid() {
        System.out.println("每天整點的10分: 預訂後，但三個小時尚未付款的:" + new Date());

        //找出3小時前產生的預定單，且狀態為未付款的
        //目前12:00，找出8:00~9:00間送出的單
        String subject = "【JoyShot付款提醒】您的預約還差一步就完成了\n\n";
        String separate = "\n";

        LocalDateTime now = LocalDateTime.from(new Date().toInstant().atZone(ZoneId.of("UTC+8")));
        LocalDateTime fourHourBefore = now.minusHours(4);
        String startDate = fourHourBefore.format(pattern);

        LocalDateTime threeHourBefore = now.minusHours(3);
        String endDate = threeHourBefore.format(pattern);

        List<Order> orders = orderMapper.findOrderNotPaid(startDate, endDate);
        for (Order order : orders) {
            System.out.println(order.getOrderNo() + " 下訂時間:" + order.getCreatedAt());
            orderService.paymentRemind(order.getId());
        }
    }

    public void releaseSchedule() {
        System.out.println("每天整點的15分: 預訂後，但24小時尚未付款的:" + new Date());
    }

    public void notifyNotContactCustomer() {
        System.out.println("每天 09:00~21:00 間，每個小時的第10分鐘:" + new Date());
        List<Order> orders = orderMapper.findNotContactCustomerOrder();
        for (Order order : orders) {
            orderService.contactRemind(order);
        }
    }

    public void prepareBilling() {
        System.out.println("每月4,14,24號 10:00" + new Date());
        LocalDate today = LocalDate.now();
        String tomorrow = (today.plusDays(1)).format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
//        String tomorrow = "2023/07/05";
        System.out.println("tomorrow:" + tomorrow);
        List<Order> orders = orderMapper.findClosingOrder();

        List<Order> billingNotifyOrders = null;
        billingNotifyOrders = orders.stream()
                .filter((Order order) -> order.getPayDate().equals(tomorrow))
                .collect(Collectors.toList());

        if (billingNotifyOrders != null) {
            System.out.println("billingNotifyOrders:" + billingNotifyOrders);
        } else {
            System.out.println("No billingNotifyOrders:");
        }
        orderService.notifyBillingManager(billingNotifyOrders, tomorrow);
    }


    public void cancelProcessingOrder() {
        System.out.println("超過24小時未付款訂單，解除訂單，解開攝影師時段:" + new Date());

        //訂單建立時間是24小時前的，且狀態為未付款的
        //ex:目前14:00，找出前一天13:00~14:00間送出的單

        LocalDateTime now = LocalDateTime.from(new Date().toInstant().atZone(ZoneId.of("UTC+8")));
        LocalDateTime fourHourBefore = now.minusHours(25);
        String startDate = fourHourBefore.format(pattern);

        LocalDateTime threeHourBefore = now.minusHours(24);
        String endDate = threeHourBefore.format(pattern);

        List<Order> orders = orderMapper.findOrderNotPaid(startDate, endDate);
        for (Order order : orders) {
            orderService.cancelOrder(order);
        }
    }

    public void notifyPhotographerToUpdateSchedule() {
        List<User> users = userMapper.findPhotographer();
        lineService.notifyPhotographerToUpdateSchedule(users);
    }

    public void startBackupCron() {
        //找出尚未備份完成的工作
        List<BackupCron> backupNotDone = backupCronMapper.getBackupNotDone();
        for (BackupCron cron : backupNotDone ) {
            System.out.println(cron);

            String orderNo = cron.getOrderNo();
            Order order = orderMapper.findByOrderNo(orderNo);
            backupCronMapper.setRunninig(cron.getId());
            String folder = order.getDriverLink();
            if (folder != null && folder.length() > 0) {
                String folderId = folder.substring(folder.lastIndexOf("/") + 1);
                System.out.println(folderId);
                try {
                    //建立備份目錄
                    String googleDriveBackupFoler = gdriverUtil.createGoogleDriveBackupFoler(orderNo);
                    String destinationFolderId = googleDriveBackupFoler.substring(googleDriveBackupFoler.lastIndexOf("/") + 1);
                    gdriverUtil.doBackup(orderNo, folderId, destinationFolderId);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void notifyTeamThePhotoNotUpload() {
        System.out.println("拍攝後18小時尚未完成上的，通知js:" + new Date());

        //找出拍攝後18小時尚未完成上的，通知js

        LocalDateTime now = LocalDateTime.from(new Date().toInstant().atZone(ZoneId.of("UTC+8")));
        LocalDateTime fourHourBefore = now.minusHours(1);
        String startDate = fourHourBefore.format(pattern);

        LocalDateTime threeHourBefore = now.minusHours(0);
        String endDate = threeHourBefore.format(pattern);

        List<Order> orders = orderMapper.findOrderInContact(startDate, endDate);
        orderService.remindNotUpload(orders);
    }

    public void notifyPhotographerScheduleInTwoWeeks() {
        LocalDate now = LocalDate.now();
        int dayOfMonth = now.getDayOfMonth();
//        System.out.println(dayOfMonth);

        String today = now.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String endDate = now.plusDays(14).format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        if (dayOfMonth == 15) {
            LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());
            endDate = lastDayOfMonth.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        }


        System.out.println(today);
        System.out.println(endDate);

        List<User> users = userMapper.findPhotographer();
        for (User user : users) {
            Integer phId = user.getPhId();
            String email = user.getEmail();
//            if (!user.getUsername().equals("HOU")) {
//                continue;
//            }


            List<PhotographerSchedule> photographerSchedules = photographerScheduleMapper.findPhotographerSchedule(phId, today, endDate);

            StringBuffer sb = new StringBuffer();
            String subject = user.getUsername() + " 您好，提醒您 " + today + "~" + endDate + " 設定的接案時程";
            if (photographerSchedules.size() > 0) {
                sb.append(today + "~" + endDate + " 您設定可接案時段:<BR><BR>");
                for (PhotographerSchedule schedule : photographerSchedules) {
                    sb.append(schedule.getScheduleDate() + " " + schedule.getSlotStartLabel() + "~" + schedule.getSlotEndLabel() + "<br>");
                    System.out.println(schedule.getScheduleDate() + "-" + schedule.getSlotStartLabel() + "~" + schedule.getSlotEndLabel());
                }

                sb.append("<BR><BR>若有異動請記得至後台更新<BR><BR>");
                sb.append("https://jsmaster.joyshot.app");
                mailUtil.sendHtmlEmail(email,
                        EMAIL_BCC,
                        subject,
                        sb.toString() );
            } else {
                sb.append("<BR><BR>" + today + "~" + endDate + " 您未設定可接案時段，若需異動請記得至後台更新<BR><BR>");
                sb.append("https://jsmaster.joyshot.app");
                mailUtil.sendHtmlEmail(email,
                        EMAIL_BCC,
                        subject,
                        sb.toString()  );
            }
        }
    }
}
