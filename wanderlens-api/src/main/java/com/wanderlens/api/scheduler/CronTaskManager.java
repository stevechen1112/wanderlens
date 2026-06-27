package com.wanderlens.api.scheduler;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.wanderlens.api.entity.Album;
import com.wanderlens.api.entity.Order;
import com.wanderlens.api.entity.ShootEvent;
import com.wanderlens.api.entity.Provider;
import com.wanderlens.api.entity.enums.OrderStatus;
import com.wanderlens.api.entity.enums.ShootEventType;
import com.wanderlens.api.mapper.AlbumMapper;
import com.wanderlens.api.mapper.ProviderMapper;
import com.wanderlens.api.mapper.ShootEventMapper;
import com.wanderlens.api.service.AvailabilityService;
import com.wanderlens.api.service.NotifyService;
import com.wanderlens.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * 排程任務管理器
 *
 * 5 個核心排程：
 * 1. 24h 聯繫提醒 — 拍攝前 24H 提醒攝影師聯繫
 * 2. RAW 上傳提醒 — 拍攝後 12H/18H 提醒上傳
 * 3. 自動取消 — 超過 24H 未付款自動取消
 * 4. 48h SLA 告警 — AI 交付 SLA 倒數
 * 5. 關帳通知 — 定期關帳通知
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CronTaskManager {

    private final OrderService orderService;
    private final NotifyService notifyService;
    private final AvailabilityService availabilityService;
    private final ShootEventMapper shootEventMapper;
    private final ProviderMapper providerMapper;
    private final AlbumMapper albumMapper;

    /**
     * 排程 1：拍攝前 24H 提醒攝影師聯繫
     * 每小時 01 分執行
     */
    @Scheduled(cron = "0 1 * * * *")
    public void remindContactBeforeShoot() {
        log.info("[排程] 拍攝前 24H 聯繫提醒開始");

        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.WAITING_PROVIDER_CONTACT.getCode())
                .eq(Order::getShootingDate, tomorrow));

        for (Order order : orders) {
            // 詳細通知模板（參考 JS CronTask.remindPhotographer）
            StringBuilder msg = new StringBuilder();
            msg.append("攝影師您好，明日將有一場預約服務！\n\n");
            msg.append("訂單編號：").append(order.getOrderNo()).append("\n");
            msg.append("客戶名稱：").append(order.getCustomerName() != null ? order.getCustomerName() : "—").append("\n");
            msg.append("聯繫電話：").append(order.getCustomerPhone() != null ? order.getCustomerPhone() : "—").append("\n");
            msg.append("拍攝日期：").append(order.getShootingDate()).append("\n");
            msg.append("拍攝時間：").append(order.getShootingTime() != null ? order.getShootingTime() : "—").append("\n");
            msg.append("拍攝時數：").append(order.getShootingDuration() != null ? order.getShootingDuration() : "—").append(" 小時\n");
            msg.append("拍攝地點：").append(order.getShootingLocation() != null ? order.getShootingLocation() : "—").append("\n");
            msg.append("\n請注意：\n");
            msg.append("1. 請於服務開始前透過站內訊息聯繫客戶確認需求\n");
            msg.append("2. 請於預約時間前抵達，自我介紹為 WanderLens 合作攝影師\n");
            msg.append("3. 拍攝開始與結束時請至攝影師端回報\n");
            msg.append("4. 拍攝完畢後請於 24 小時內上傳 RAW 檔案\n");

            notifyService.triggerFlow("contact_reminder", order.getPhotographerId(),
                    "拍攝提醒 — 明日預約", msg.toString());
        }

        log.info("[排程] 拍攝前 24H 聯繫提醒完成，通知 {} 筆訂單", orders.size());
    }

    /**
     * 排程 2：拍攝後 12H 提醒上傳 RAW
     * 每小時 05 分執行
     */
    @Scheduled(cron = "0 5 * * * *")
    public void remindUploadRaw() {
        log.info("[排程] RAW 上傳提醒開始");

        LocalDate yesterday = LocalDate.now().minusDays(1);
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.SHOOTING_ENDED.getCode())
                .eq(Order::getShootingDate, yesterday));

        for (Order order : orders) {
            StringBuilder msg = new StringBuilder();
            msg.append("攝影師您好，今天拍攝辛苦了！\n\n");
            msg.append("訂單編號：").append(order.getOrderNo()).append("\n");
            msg.append("拍攝日期：").append(order.getShootingDate()).append("\n\n");
            msg.append("提醒您，請於拍攝結束後 24 小時內：\n");
            msg.append("1. 將照片整理篩選後上傳 RAW 檔案\n");
            msg.append("2. 至攝影師端回報照片張數\n");
            msg.append("3. 經平台驗收確認後，即完成本次訂單\n\n");
            msg.append("本次服務費將於結案後撥款至您登記的帳戶。\n");
            msg.append("感謝您對 WanderLens 的支持！");

            notifyService.triggerFlow("upload_reminder", order.getPhotographerId(),
                    "RAW 上傳提醒 — 拍攝已結束", msg.toString());
        }

        log.info("[排程] RAW 上傳提醒完成，通知 {} 筆訂單", orders.size());
    }

    /**
     * 排程 3：超過 24H 未付款自動取消
     * 每小時 20 分執行
     */
    @Scheduled(cron = "0 20 * * * *")
    public void autoCancelUnpaidOrders() {
        log.info("[排程] 自動取消未付款訂單開始");

        LocalDateTime deadline = LocalDateTime.now().minusHours(24);
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.PENDING_PAYMENT.getCode())
                .lt(Order::getCreatedAt, deadline));

        for (Order order : orders) {
            orderService.cancelOrder(order.getId(), "超過 24 小時未付款，系統自動取消", "SYSTEM");

            // 通知消費者
            notifyService.triggerFlow("auto_cancel", order.getConsumerId(),
                    "訂單自動取消",
                    "您的訂單 " + order.getOrderNo() + " 超過 24 小時未完成付款，已自動取消。\n\n"
                    + "如仍需預約，請重新至 WanderLens 搜尋攝影師。\n"
                    + "如有疑問，請透過站內訊息聯繫客服。");

            // 通知攝影師
            notifyService.triggerFlow("auto_cancel", order.getPhotographerId(),
                    "訂單已取消",
                    "訂單 " + order.getOrderNo() + " 因客戶未於 24 小時內付款，已自動取消。\n"
                    + "您的時段已釋放，可接受其他預約。");
        }

        log.info("[排程] 自動取消完成，取消 {} 筆訂單", orders.size());
    }

    /**
     * 排程 4：48h SLA 告警 — AI 交付即將逾時
     * 每小時 50 分執行
     */
    @Scheduled(cron = "0 50 * * * *")
    public void slaAlert() {
        log.info("[排程] 48h SLA 告警開始");

        // 查找 AI 處理中的訂單
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.AI_PROCESSING.getCode()));

        LocalDateTime now = LocalDateTime.now();
        int alertCount = 0;

        for (Order order : orders) {
            LocalDateTime slaStart = resolveSlaStartTime(order);
            if (slaStart == null) continue;

            long hoursElapsed = Duration.between(slaStart, now).toHours();

            if (hoursElapsed >= 36) {
                // 即將逾時（36h+）
                notifyService.triggerFlow("sla_alert", order.getConsumerId(),
                        "交付延遲通知",
                        "訂單 " + order.getOrderNo() + " 照片處理中，預計即將完成交付。");
                notifyService.triggerFlow("sla_alert", order.getPhotographerId(),
                        "SLA 告警",
                        "訂單 " + order.getOrderNo() + " AI 處理已超過 " + hoursElapsed + " 小時，請關注。");
                alertCount++;
            }

            if (hoursElapsed >= 48) {
                // 已逾時 — 通知營運人員
                log.warn("[排程] SLA 已逾時: orderNo={}, hours={}", order.getOrderNo(), hoursElapsed);
                notifyService.triggerFlow("sla_alert", 0L, // userId=0 表示系統管理員
                        "SLA 逾時告警",
                        "訂單 " + order.getOrderNo() + " AI 處理已超過 " + hoursElapsed + " 小時，"
                        + "已逾 48 小時 SLA。請營運人員立即介入處理。");
            }
        }

        log.info("[排程] 48h SLA 告警完成，告警 {} 筆訂單", alertCount);
    }

    /**
     * 排程 4.5：未聯繫客戶提醒 — 每日 09:00~21:00 每小時 10 分
     * 付款後 24H 內攝影師未聯繫 → 提醒攝影師
     */
    @Scheduled(cron = "0 10 9-21 * * *")
    public void remindNotContactCustomer() {
        log.info("[排程] 未聯繫客戶提醒開始");

        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.WAITING_PROVIDER_CONTACT.getCode()));

        LocalDateTime now = LocalDateTime.now();
        int count = 0;
        for (Order order : orders) {
            if (order.getModifiedAt() == null) continue;
            long hoursSincePaid = Duration.between(order.getModifiedAt(), now).toHours();
            // 付款後超過 12 小時仍未聯繫 → 提醒
            if (hoursSincePaid >= 12) {
                notifyService.triggerFlow("contact_reminder", order.getPhotographerId(),
                        "請儘速聯繫客戶",
                        "訂單 " + order.getOrderNo() + " 已付款 " + hoursSincePaid + " 小時，"
                        + "您尚未聯繫客戶。請透過站內訊息儘速聯繫。\n"
                        + "客戶：" + (order.getCustomerName() != null ? order.getCustomerName() : "—")
                        + " / 電話：" + (order.getCustomerPhone() != null ? order.getCustomerPhone() : "—"));
                count++;
            }
        }

        log.info("[排程] 未聯繫客戶提醒完成，通知 {} 筆訂單", count);
    }

    /**
     * 排程 5：關帳通知
     * 每月 4/14/24 號 10:00 執行
     */
    @Scheduled(cron = "0 0 10 4,14,24 * *")
    public void closingNotification() {
        log.info("[排程] 關帳通知開始");

        // 只查詢最近 10 天內結案的訂單，避免重複通知
        LocalDate recentDate = LocalDate.now().minusDays(10);
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                .ge(Order::getModifiedAt, recentDate.atStartOfDay()));

        for (Order order : orders) {
            notifyService.triggerFlow("closing_notification", order.getPhotographerId(),
                    "關帳通知",
                    "訂單 " + order.getOrderNo() + " 已結案，撥款將於近期處理。");
        }

        log.info("[排程] 關帳通知完成，通知 {} 筆訂單", orders.size());
    }

    /**
     * 排程 6：回訪召回 — 拍攝週年推播
     * 每天上午 10:00 執行
     */
    @Scheduled(cron = "0 0 10 * * *")
    public void anniversaryRecall() {
        log.info("[排程] 拍攝週年召回開始");

        LocalDate today = LocalDate.now();

        // 查詢 1~5 年前今天拍攝的已結案訂單
        for (int yearsAgo = 1; yearsAgo <= 5; yearsAgo++) {
            LocalDate anniversaryDate = today.minusYears(yearsAgo);
            List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                    .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                    .eq(Order::getShootingDate, anniversaryDate));

            for (Order order : orders) {
                Album album = findAlbum(order.getId());
                String location = order.getShootingLocation() != null ? order.getShootingLocation() : "台灣";
                notifyService.triggerFlow("anniversary_recall", order.getConsumerId(),
                        yearsAgo + " 週年回憶",
                        yearsAgo + " 年前的今天，您在 " + location + " 完成了拍攝。回顧您的精彩照片 →",
                        recallUrl(album, order.getId()),
                        order.getId(),
                        album != null ? album.getId() : null);
            }

            if (!orders.isEmpty()) {
                log.info("[排程] {} 週年召回: 通知 {} 位消費者", yearsAgo, orders.size());
            }
        }

        log.info("[排程] 拍攝週年召回完成");
    }

    /**
     * 排程 7：回訪召回 — 寶寶月份推播
     * 每月 1 日上午 11:00 執行
     */
    @Scheduled(cron = "0 0 11 1 * *")
    public void babyMonthRecall() {
        log.info("[排程] 寶寶月份召回開始");

        // 查詢寶寶寫真類型（serviceTypeId=4）的相簿
        // 依拍攝日期計算寶寶月齡，每月推播
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        List<Order> babyOrders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                .eq(Order::getServiceTypeId, 4L)); // 4 = 寶寶寫真

        int currentMonth = LocalDate.now().getMonthValue();
        for (Order order : babyOrders) {
            if (order.getShootingDate() == null) continue;
            int monthsSince = (int) java.time.temporal.ChronoUnit.MONTHS.between(
                    order.getShootingDate(), LocalDate.now());
            // 每滿一個月推播（1月、2月、3月...最多到 12 月）
            if (monthsSince > 0 && monthsSince <= 12) {
                Album album = findAlbum(order.getId());
                notifyService.triggerFlow("baby_month_recall", order.getConsumerId(),
                        "寶寶 " + monthsSince + " 個月",
                        "您的寶寶已經 " + monthsSince + " 個月了！回顧拍攝回憶 →",
                        recallUrl(album, order.getId()),
                        order.getId(),
                        album != null ? album.getId() : null);
            }
        }

        log.info("[排程] 寶寶月份召回完成");
    }

    /**
     * 排程 8：24h 未聯繫 → 自動重新媒合
     */
    @Scheduled(cron = "0 30 * * * *")
    public void autoRematchNoContact() {
        log.info("[排程] 24h 未聯繫自動 rematch 開始");
        List<Order> orders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.WAITING_PROVIDER_CONTACT.getCode()));
        LocalDateTime now = LocalDateTime.now();
        int count = 0;
        for (Order order : orders) {
            if (order.getModifiedAt() == null) continue;
            long hours = Duration.between(order.getModifiedAt(), now).toHours();
            if (hours >= 24) {
                orderService.rematch(order.getId(), "付款後 24 小時內攝影師未聯繫，系統自動重新媒合");
                notifyService.triggerFlow("rematch", order.getConsumerId(),
                        "重新媒合通知",
                        "訂單 " + order.getOrderNo() + " 因攝影師未及時聯繫，已進入重新媒合。客服將協助安排或退款。");
                count++;
            }
        }
        log.info("[排程] 自動 rematch 完成，處理 {} 筆", count);
    }

    /**
     * 排程 9：暫停到期恢復上架
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void restoreSuspendedProviders() {
        log.info("[排程] 暫停到期恢復開始");
        List<Provider> providers = providerMapper.selectList(new LambdaQueryWrapper<Provider>()
                .eq(Provider::getViolationLevel, "SUSPENDED")
                .le(Provider::getSuspendedUntil, LocalDateTime.now()));
        for (Provider p : providers) {
            p.setGoLive("Y");
            p.setViolationLevel("NONE");
            p.setSuspendedUntil(null);
            providerMapper.updateById(p);
            notifyService.triggerFlow("provider_restored", p.getId(),
                    "接案資格恢復", "您的暫停期間已結束，可重新接案。");
        }
        log.info("[排程] 暫停恢復完成，恢復 {} 位", providers.size());
    }

    /**
     * 排程 10：旅遊回顧召回（旅拍類型 serviceTypeId=11 或含 travel 標籤）
     */
    @Scheduled(cron = "0 30 10 1 * *")
    public void travelRecall() {
        log.info("[排程] 旅遊回顧召回開始");
        LocalDate lastMonth = LocalDate.now().minusMonths(1);
        List<Order> travelOrders = orderService.list(new LambdaQueryWrapper<Order>()
                .eq(Order::getStatus, OrderStatus.CLOSED.getCode())
                .ge(Order::getShootingDate, lastMonth.minusMonths(11))
                .in(Order::getServiceTypeId, List.of(11L, 12L))); // 旅拍/入境旅拍
        for (Order order : travelOrders) {
            Album album = findAlbum(order.getId());
            String location = order.getShootingLocation() != null ? order.getShootingLocation() : "台灣";
            notifyService.triggerFlow("travel_recall", order.getConsumerId(),
                    "旅遊回憶",
                    "回味您在 " + location + " 的旅拍 →",
                    recallUrl(album, order.getId()),
                    order.getId(),
                    album != null ? album.getId() : null);
        }
        log.info("[排程] 旅遊回顧召回完成，通知 {} 位", travelOrders.size());
    }

    private LocalDateTime resolveSlaStartTime(Order order) {
        ShootEvent endEvent = shootEventMapper.selectOne(new LambdaQueryWrapper<ShootEvent>()
                .eq(ShootEvent::getOrderId, order.getId())
                .eq(ShootEvent::getEventType, ShootEventType.SHOOT_END.getCode())
                .orderByDesc(ShootEvent::getEventTime)
                .last("LIMIT 1"));
        if (endEvent != null && endEvent.getEventTime() != null) {
            return endEvent.getEventTime();
        }
        return order.getModifiedAt();
    }

    private Album findAlbum(Long orderId) {
        return albumMapper.selectOne(new LambdaQueryWrapper<Album>()
                .eq(Album::getOrderId, orderId)
                .last("LIMIT 1"));
    }

    private String recallUrl(Album album, Long orderId) {
        if (album != null) {
            return "wanderlens://album/" + album.getId();
        }
        return "wanderlens://history?orderId=" + orderId;
    }
}