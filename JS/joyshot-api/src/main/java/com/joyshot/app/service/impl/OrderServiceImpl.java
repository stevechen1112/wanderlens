package com.joyshot.app.service.impl;

import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.joyshot.app.entity.*;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.*;
import com.joyshot.app.service.BackupCronService;
import com.joyshot.app.service.CouponService;
import com.joyshot.app.service.LineService;
import com.joyshot.app.service.OrderService;
import com.joyshot.app.util.GdriverUtil;
import com.joyshot.app.util.MailUtil;
import com.joyshot.app.util.SmsUtil;
import ecpay.payment.integration.AllInOne;
import ecpay.payment.integration.domain.AioCheckOutALL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.MessagingException;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
* @author avery
* @description【order】的資料庫操作Service实现
*/
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order>
    implements OrderService {

    @Autowired
    private LineService lineService;

    @Autowired
    private VFlowUserMapper vFlowUserMapper;

    @Autowired
    private AppFlowMapper appFlowMapper;

    @Autowired
    private PhotographerMapper photographerMapper;

    @Autowired
    private PhotographerScheduleMapper photographerScheduleMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private GdriverUtil gdriverUtil;

    @Autowired
    private DictMapper dictMapper;

    @Autowired
    private CouponService couponService;

    @Autowired
    private OrderHistoryMapper orderHistoryMapper;

    @Autowired
    private BackupCronService backupCronService;


    @Value("${line.message-root-url}")
    private String LINE_MESSAGE_ROOT;

    @Value("${ecpay.return-url}")
    private String ECPAY_RETURN_URL;

    @Value("${ecpay.order-result-url}")
    private String ECPAY_RESULT_URL;

    @Value("${order.paid}")
    private String ORDER_PAID_TITLE;

    @Value("${email.pay-url}")
    private String EMAIL_PAY_URL;

    @Value("${email.bcc}")
    private String EMAIL_BCC;

    @Value("${email.js-front}")
    private String JS_FRONT;

    @Value("${email.js-photographer}")
    private String JS_PHOTOGRAPHER;

    @Value("${bypass}")
    private String BY_PASS_USER;

    @Value("${sms.url}")
    private String SMS_URL;

    @Value("${sms.username}")
    private String SMS_USERNAME;

    @Value("${sms.password}")
    private String SMS_PASSWORD;

    @Autowired
    MailUtil mailUtil;

    @Autowired
    SmsUtil smsUtil;

    private DateTimeFormatter pattern = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");

    @Override
    public Order createOrder(Order order) {
        LocalDateTime ldt = LocalDateTime.now();
        String orderNo = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSS", Locale.ENGLISH)
                .format(ldt);
        order.setOrderNo(orderNo);
        boolean save = this.save(order);
        System.out.println("save:" + save);
        if (save) {
            if (BY_PASS_USER.equals(order.getCustomerName())) {
                System.out.println("測試單，不發訊息:" + BY_PASS_USER);
            } else {
                System.out.println("收單通知(待付款)-"+orderNo);
                Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
                String lineMsg = getOrderInfo(order, photographer, "\n" );
                triggerFlowLineNotify("order_created", "\n收單通知(待付款)\n", lineMsg);

                //更新攝影師的時段變成不能選
                updatePhotographerScheduleState( order, photographer,"N");
            }
        }
        return order;
    }

    /**
     * 通知客戶尚未付款
     * @param order
     */
    public void notifyCustomer(Order order) {
        LocalDateTime orderCreated = LocalDateTime.from(order.getCreatedAt().toInstant().atZone(ZoneId.of("UTC+8")));

        String delimeter = "<BR>";
        String subject = "【JoyShot付款提醒】您的預約還差一步就完成了!";
        String body = order.getCustomerName() + " 您好，感謝您在 JoyShot 預約拍攝，麻煩您於【24h內完成付款】" + delimeter;
        body += "付款連結：" + EMAIL_PAY_URL + order.getId() + order.getOrderNo() + delimeter + delimeter;
        body += "如24h內未付款成功，預約將自動取消。" + delimeter;
        body += "如付款成功，攝影師將於24小時內與您聯繫。" + delimeter;
        body += "預約日期：" + orderCreated.format(pattern) + delimeter;
        body += "訂單編號：" + order.getOrderNo() + delimeter;
        body += "預約人：" + order.getCustomerName() + delimeter;
        body += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + delimeter;
        body += "時數：" + order.getShootingDuration() + delimeter;
        body += "聯繫地點：" + order.getShootingLocation() + delimeter;
        body += "＊備註：" + order.getExtraInfo() + delimeter + delimeter;

        body += "有任何問題，請聯繫我們 messenger:" + delimeter;
        body += "https://www.facebook.com/joyshotapp" + delimeter + delimeter;

        body += "\\全台旅拍活動隨行攝影預訂平台/" + delimeter;
        body += JS_FRONT + delimeter;

        mailUtil.sendHtmlEmail(order.getEmail(),
                EMAIL_BCC,
                subject,
                body );
    }

    private String getOrderInfo(Order order, Photographer photographer, String separate) {
        String msg = "";
        String couponCode = (order.getCouponCode() == null) ? "" : order.getCouponCode();

        msg += "訂單編號：" + order.getOrderNo() + separate;
        msg += "使用折扣碼：" + couponCode + separate;
        msg += "攝影師：" + photographer.getNickName() + separate ;
        msg += "攝影師所在地：" + photographer.getCity() + separate + separate;
        msg += "客戶名稱：" + order.getCustomerName() + separate;
        msg += "聯繫電話：" + order.getCustomerPhone() + separate;
        msg += "方便連絡的時間：" + order.getContactTime() + separate;
        msg += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + separate;
        msg += "時數：" + order.getShootingDuration() + separate;
        msg += "人數：" + order.getShootingPersons() + separate;
        msg += "拍攝地點：" + order.getShootingLocation() + separate;
        msg += "＊備註：" + order.getExtraInfo() + separate + separate;
        return msg;
    }

    /**
     * 付款成功後，通知
     * 1.攝影師(LINE)
     * 2.客服(LINE+EMAIL)
     * @param order
     * @param photographer
     * @throws MessagingException
     */
    private void notifyPaymentSuccess(Order order, Photographer photographer) throws MessagingException {
        //line通知攝影師
       // String subject = ORDER_PAID_TITLE + photographer.getNickName() + " 您好，您有一筆新的預約";

        User user = userMapper.selectByPhId(photographer.getId());
        if (user.getLineToken() != null && !"".equals(user.getLineToken())) {
            lineNotifyPhotographer(order, photographer, user);
        }

        //email通知客服、攝影師
        if (photographer.getEmail() != null && !"".equals(photographer.getEmail())) {
            //email
            String content = mailBodyForPhotographerAfterPayment(order, photographer);
            mailUtil.sendHtmlEmail(photographer.getEmail(),
                    EMAIL_BCC,
                                    "【JoyShot 新預約訂單通知】",
                                    content );
        }

        String lineMsg = getOrderInfo(order, photographer, "\n" );
        triggerFlowLineNotify("order_paid", "\n訂單通知(已付款)\n", lineMsg);
    }

    private void notifyManualSuccess(Order order, Photographer photographer) throws MessagingException {
        //line通知攝影師
        String lineMsg = getOrderInfo(order, photographer, "\n" );
        User user = userMapper.selectByPhId(photographer.getId());
        if (user.getLineToken() != null && !"".equals(user.getLineToken())) {
            lineNotifyPhotographer(order, photographer, user);
        }

        //email通知客服、攝影師
        if (photographer.getEmail() != null && !"".equals(photographer.getEmail())) {
            //email
            String content = mailBodyForPhotographerAfterPayment(order, photographer);
            mailUtil.sendHtmlEmail(photographer.getEmail(),
                    EMAIL_BCC,
                    "【JoyShot 新預約訂單通知】",
                    content );
        }

        triggerFlowLineNotify("order_paid", "後台手動訂單通知\n", lineMsg);
    }

    private String mailBodyForPhotographerAfterPayment(Order order, Photographer photographer) {
        String body = photographer.getNickName() + "攝影師，您有新的預約訂單！<BR><BR>";
        body += "訂單編號：" + order.getOrderNo() + "<BR>";
        body += "客戶名稱：" + order.getCustomerName() + "<BR>";
        body += "聯繫電話：" + order.getCustomerPhone() + "<BR>";
        body += "方便連絡的時間：" + order.getContactTime() + "<BR>";
        body += "拍攝類型：" + order.getServiceCat() + "<BR>";
        body += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + "<BR>";
        body += "時數：" + order.getShootingDuration() + "<BR>";
        body += "人數：" + order.getShootingPersons() + "<BR>";
        body += "拍攝地點：" + order.getShootingLocation() + "<BR>";
        body += "＊備註：" + order.getExtraInfo() + "<BR>";
        body += "拍攝費：$" + order.getPhotographerProfit() + "<BR>";
        body += "交通費：$" + order.getTransportationFeeCustomerActualPay() + "<BR><BR>";
        body += "請注意：<BR>";
        body += "1. 請務必於訂單成立後24Ｈ內與客戶聯繫、確認需求完成。<BR>";
        body += "2. 若聯繫不上客戶，請於第一時間回報於JoyShot 官方Line。<BR>";
        body += "3. 若您臨時無法提供服務或客戶需求有狀況，請務必儘速聯繫JoyShot 官方Line處理。<BR>";
        return body;
    }

    private void lineNotifyPhotographer(Order order, Photographer photographer, User user) {
//        System.out.println("通知攝影師:" + subject);
        String delimeter = "\n";
        String subject = "\n【JoyShot 新預約訂單通知】" + delimeter;
        String body = photographer.getNickName() + "攝影師，您有新的預約訂單！" + delimeter + delimeter;
        body += "訂單編號：" + order.getOrderNo() + delimeter;
        body += "客戶名稱：" + order.getCustomerName() + delimeter;
        body += "聯繫電話：" + order.getCustomerPhone() + delimeter;
        body += "方便連絡的時間：" + order.getContactTime() + delimeter;
        body += "拍攝類型：" + order.getServiceCat() + delimeter;
        body += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + delimeter;
        body += "時數：" + order.getShootingDuration() + delimeter;
        body += "人數：" + order.getShootingPersons() + delimeter;
        body += "拍攝地點：" + order.getShootingLocation() + delimeter;
        body += "＊備註：" + order.getExtraInfo() + delimeter;
        body += "拍攝費：" + order.getPhotographerProfit() + delimeter;
        body += "交通補貼：" + order.getTransportationFeeCustomerActualPay() + delimeter;

        body += delimeter + delimeter;
        body += "1. 請務必於訂單成立後24Ｈ內與客戶聯繫、確認需求完成。" + delimeter;
        body += "2. 若聯繫不上客戶，請於第一時間回報於 JoyShot 官方Line。" + delimeter;
        body += "3. 若您臨時無法提供服務或客戶需求有狀況，請務必儘速聯繫 JoyShot 官方Line處理。" + delimeter;

        lineService.sendLineNotify(user.getLineToken(), subject + body);
    }

    /**
     * LINE通知流程對應人員
     * @param flowType
     * @param subject
     * @param content
     */
    private void triggerFlowLineNotify(String flowType, String subject, String content) {
        AppFlow flow = appFlowMapper.selectByType(flowType);
        List<VFlowUser> vFlowUsers = vFlowUserMapper.selectByFlowId(flow.getId());

        for (VFlowUser vFlowUser : vFlowUsers) {
            String lineMsg = subject;
            lineMsg += content;
            lineMsg += LINE_MESSAGE_ROOT + "/orders/maintain";

            //send notify
            if (vFlowUser.getLineToken() != null && !vFlowUser.getLineToken().equals("")) {
                lineService.sendLineNotify(vFlowUser.getLineToken(), lineMsg);
            }
        }
    }




    private void updatePhotographerScheduleState(Order order, Photographer photographer, String active) {
        Integer phId = photographer.getId();
        String shootingDate = order.getShootingDate();
        photographerScheduleMapper.changeState(phId, shootingDate, active);
    }

    @Override
    public String ecpayCheckout(Integer orderId) {
        Order order = orderMapper.selectById(orderId);
        System.out.println("TradeNo:" + order.getOrderNo());

        String patter = "yyyy/MM/dd HH:mm:ss";
        SimpleDateFormat sdf = new SimpleDateFormat(patter);
        String date = sdf.format(new Date());

        AllInOne all = new AllInOne("");
        AioCheckOutALL obj = new AioCheckOutALL();
        obj.setCustomField1(orderId+"");
        String uuid = IdUtil.fastSimpleUUID().substring(0,3);
        obj.setMerchantTradeNo(order.getOrderNo()+uuid);
        obj.setMerchantTradeDate(date);
        obj.setTotalAmount(order.getTotalFee()+"");
        obj.setTradeDesc("JoyShot旅拍"+order.getShootingDuration()+"小時");
        obj.setItemName(order.getShootingDuration()+"小時");
        obj.setReturnURL(ECPAY_RETURN_URL);
        obj.setOrderResultURL(ECPAY_RESULT_URL);
//        obj.setClientBackURL("https://ea85-36-228-76-211.ngrok-free.app/thankyou/"+uuId);
        obj.setNeedExtraPaidInfo("N");

//        InvoiceObj invoice = new InvoiceObj();
//        invoice.setCustomerName("My User Name");
//        invoice.setCustomerPhone("0909111222");
//        invoice.setCustomerEmail("avery.hou@gmail.com");
//        invoice.setInvoiceItemName("Joyshot旅拍"); //商品名稱
//        invoice.setInvoiceItemPrice("1288"); //商品價格
//        invoice.setInvoiceItemCount("1"); //商品數量
//        invoice.setInvoiceItemWord("小時"); //商品單位
//        invoice.setInvType("07"); //07：一般稅額
//        invoice.setTaxType("1"); //1：應稅。
//        invoice.setInvoiceItemTaxType("2");
        String form = all.aioCheckOut(obj, null);
        return form;
    }

    @Override
    public void handlePaymentFail(HttpServletRequest request) {
        String orderId = request.getParameter("CustomField1");
        String tradeNo = request.getParameter("TradeNo"); //綠界訂單編號
        String orderNo = request.getParameter("MerchantTradeNo");
        String rtnCode = request.getParameter("RtnCode");
        mailUtil.sendHtmlEmail("service@joyshot.app",
                EMAIL_BCC,
                "刷卡失敗",
                orderNo + " 刷卡失敗" );
        //update db
        orderMapper.updateOrderPayFailed(orderId, tradeNo, rtnCode, "ecpay");

        triggerFlowLineNotify("pay_failed", "刷卡失敗-"+orderNo, "刷卡失敗");

        Order order = orderMapper.selectById(orderId);
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
        updatePhotographerScheduleState( order, photographer, "Y");
    }

    /**
     * 付款成功後:
     * 更新訂單狀態
     * 通知攝影師
     * 通知客戶
     * 建立google照片目錄
     * @param request
     * @throws IOException
     */
    @Override
    public void handlePaymentSuccess(HttpServletRequest request) throws IOException {
        String orderId = request.getParameter("CustomField1");
        String rtnCode = request.getParameter("RtnCode");
        String tradeNo = request.getParameter("TradeNo"); //綠界訂單編號

        Order order = orderMapper.selectById(orderId);
        if ("processing".equals(order.getStatus())) {
            //update db
            orderMapper.updateOrderPaid(orderId, tradeNo, rtnCode, "ecpay");

            //update coupon
            couponService.updateCoupon(order);

            //notify photographer
            Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
            try {
                notifyPaymentSuccess(order, photographer);
            } catch (MessagingException e) {
                e.printStackTrace();
            }

            //通知客戶
            customerNotification(order);

            //create google drive
            String sharedLink = gdriverUtil.createGoogleDriveSharedFoler(order);
            orderMapper.updateDriverLink(orderId, sharedLink);
        } else {
            System.out.println("訂單狀態已更新:" + order.getStatus());
        }
    }

    private void customerNotification(Order order) {
        if (order.getEmail() != null && !"".equals(order.getEmail())) {
            //email通知客服
            String subject = "【JoyShot預訂成功】訂單編號：" + order.getOrderNo();
            String body = order.getCustomerName() + "，恭喜您! 您的預訂已經完成﹗<BR><BR>";
            body += "請加入 JoyShot 官方LINE@ 以便後續聯繫與取得照片，加入後請務必傳訊息告知【預訂者大名】或 【訂單編號】以開始對話<BR><BR>";
            body += "您的攝影師將於24小時內與您聯繫，拍攝後24小時內取得全數無修圖照片。<BR><BR>";
            body += "【預訂成功通知】<BR>";
            body += "訂單編號：" + order.getOrderNo() + "<BR>";
            body += "拍攝類型：" + order.getServiceCat() + "<BR>";
            body += "預訂者：" + order.getCustomerName() + "<BR>";
            body += "電話：" + order.getCustomerPhone() + "<BR>";
            body += "方便連絡的時間：" + order.getContactTime() + "<BR>";
            body += "社群媒體：" + order.getSocial() + "<BR>";
            body += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + "<BR>";
            body += "時數：" + order.getShootingDuration() + "<BR>";
            body += "人數：" + order.getShootingPersons() + "<BR>";
            body += "地點：" + order.getShootingLocation() + "<BR>";
            body += "＊備註：" + order.getExtraInfo() + "<BR>";
            body += "拍攝費：$" + order.getServiceFee() + "<BR>";
            body += "交通費：$" + order.getTransportationFeeCustomerActualPay() + "<BR>";
            body += "合計費用：$" + order.getTotal() + "<BR>";

            body += "有任何問題，請聯繫我們 messenger:<BR>";
            body += "https://www.facebook.com/joyshotapp<BR><BR>";

            body += "\\全台旅拍活動隨行攝影預訂平台/<BR>";
            body += JS_FRONT + "<BR>";
            //email
            mailUtil.sendHtmlEmail(order.getEmail(),
                    EMAIL_BCC,
                    subject,
                    body );
        } else {
            System.out.println("沒有email " + order.getId());
        }

        sendSMS(order);
    }


    private void sendSMS(Order order) {
        String sms = "【JoyShot預訂成功】\n訂單編號：" + order.getOrderNo() + "\n";
        sms += "請加入 JoyShot 官方LINE@ https://lin.ee/9Hdd4Dl 以便後續聯繫與取得照片\n";
        sms += "加入後請務必傳訊息告知【預訂者大名】或 【訂單編號】以開始對話\n";
        sms += "您的攝影師將於24小時內與您聯繫，拍攝後24小時內取得全數無修圖照片。";

        String customerPhone = order.getCustomerPhone();
        System.out.println("sendSMS:" + customerPhone);
        if (customerPhone != null) {
            smsUtil.sendSms(customerPhone, sms);
        }
    }



    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public boolean photoFinishUpload(Integer orderId) {
        //更新狀態
        orderMapper.photoFinishUpload(orderId);

        Order order = orderMapper.findOrderWithPhotographer(orderId);

//        BackupCron backupCron = new BackupCron();
//        backupCron.setOrderNo(order.getOrderNo());
//        backupCron.setPicNum(order.getPicNum());
//        backupCron.setBackupDone("N");
//        backupCron.setBackupRunning("N");
//        backupCronService.save(backupCron);

        //通知客服
        String subject = "照片已完成上傳\n\n";
        String lineMsg = "攝影師:" + order.getPhotographer().getNickName() + "\n";
        lineMsg += "訂單編號:" + order.getOrderNo() + "\n";
        lineMsg += "客戶名稱:" + order.getCustomerName() + "\n";
        lineMsg += "客戶電話:" + order.getCustomerPhone() + "\n";
        lineMsg += "拍攝日期:" + order.getShootingDate() + " " + order.getShootingTime() + "\n";
        lineMsg += "拍攝時數:" + order.getShootingDuration() + "\n";
//        lineMsg += "照片張數:" + order.getPicNum() + "\n";
        lineMsg += "照片位置:" + order.getDriverLink() + "\n\n";
        triggerFlowLineNotify("photo_uploaded", subject, lineMsg);

        return true;
    }

    @Override
    public boolean photoConfirmUpload(Integer orderId) {
        //更新狀態
        orderMapper.photoConfirmUpload(orderId);

        Order order = orderMapper.selectById(orderId);
        String link = dictMapper.selectRatingForm();
        //通知客戶
        String subject = "【JoyShot照片下載通知】訂單編號:" + order.getOrderNo();
        String body = order.getCustomerName() + " 您好，希望您喜歡這次隨行拍攝的體驗!<BR><BR>";
        body += "【照片下載通知】<BR>";
        body += "訂單編號 : " + order.getOrderNo() + "<BR>";
        body += "拍攝日期 : " + order.getShootingDate() + " " + order.getShootingTime() + "<BR>";
        body += "照片下載連結 : " + order.getDriverLink() + "<BR><BR><BR>";
        body += "【攝影師評價】: <a href='" + link + "'>點擊填寫評價</a><BR><BR>";
        body += "喜歡這次的體驗嗎? 歡迎留下您對攝影師的鼓勵<BR>";
        body += "有任何問題，請聯繫 JoyShot 顧客專屬 LINE@ 客服<BR><BR><BR>";
        body += "\\全台旅拍活動隨行攝影預訂平台/<BR>";
        body += JS_FRONT + "<BR>";
        mailUtil.sendHtmlEmail(order.getEmail(),
                EMAIL_BCC,
                subject,
                body );

        if (order.getCustomerPhone() != null) {
            String sms = "【JoyShot照片取件通知】\n";
            sms += "訂單編號:" + order.getOrderNo() + "\n";
            sms += order.getCustomerName() + " 您好，希望您喜歡這次隨行拍攝的體驗!\n";
            sms += "點擊連結，收取照片 " + order.getDriverLink();
            smsUtil.sendSms(order.getCustomerPhone(), sms);
        }

        return true;
    }

    @Override
    public boolean paymentRemind(Integer orderId) {
        Order order = orderMapper.selectById(orderId);
        notifyCustomer(order);
        return true;
    }

    @Override
    public boolean createSharedFolder(Integer orderId) throws IOException {
        Order order = this.getById(orderId);
        String link = gdriverUtil.createGoogleDriveSharedFoler(order);
        orderMapper.updateDriverLink(orderId+"", link);
        return true;
    }

    /**
     *
     * @param tradeNo
     * @param invoiceId
     */
    @Override
    public void handlePayPalSuccess(String tradeNo, String invoiceId) throws IOException {
        //update db
//        orderMapper.updatePayPalPaid(tradeNo, invoiceId);

        Order order = orderMapper.findByOrderNo(invoiceId);
        //notify photographer
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
        try {
            notifyPaymentSuccess(order, photographer);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        //通知客戶
        customerNotification(order);

        //create google drive
        String sharedLink = gdriverUtil.createGoogleDriveSharedFoler(order);
        orderMapper.updateDriverLink(order.getId()+"", sharedLink);
    }


    public void handleManualSuccess(String orderNo) throws IOException {

        Order order = orderMapper.findByOrderNo(orderNo);

        //notify photographer
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
        try {
            notifyManualSuccess(order, photographer);
        } catch (MessagingException e) {
            e.printStackTrace();
        }

        //通知客戶
        customerNotification(order);

        //create google drive
        String sharedLink = gdriverUtil.createGoogleDriveSharedFoler(order);
        orderMapper.updateDriverLink(order.getId()+"", sharedLink);
    }

    @Override
    public void handlePayPalFail(String invoiceId) {
        Order order = orderMapper.findOrderByOrderNo(invoiceId);

        mailUtil.sendHtmlEmail("service@joyshot.app",
                EMAIL_BCC,
                "刷卡失敗",
                order.getOrderNo() + " 刷卡失敗" );

        //update db
        orderMapper.updatePayPalFailed(order.getOrderNo());

        triggerFlowLineNotify("pay_failed", "刷卡失敗-"+order.getOrderNo(), "刷卡失敗");

        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());
        updatePhotographerScheduleState( order, photographer, "Y");
    }

    @Override
    public Order createPayPalOrder(Order order) throws IOException {
        boolean save = this.save(order);
        if (save) {
            handlePayPalSuccess(order.getPaymentOrderNo(), order.getOrderNo());
            Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());

            //更新攝影師的時段變成不能選
            updatePhotographerScheduleState( order, photographer,"N");
        }
        return order;
    }

    @Override
    public Order createManualOrder(Order order, User execUser) throws IOException {
        boolean save = this.save(order);
        if (save) {
            handleManualSuccess(order.getOrderNo());

            Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());

            //更新攝影師的時段變成不能選
            updatePhotographerScheduleState( order, photographer,"N");

            //寫log
            saveOrderLog(order, execUser);
        }
        return order;
    }

    private void saveOrderLog(Order order, User execUser) {
        OrderHistory history = new OrderHistory();
        history.setOrderNo(order.getOrderNo());
        history.setOrderAction("新增手動訂單");
        history.setUpdateNotes(order.getExtraInfo());
        history.setActionDetail("");
        history.setExecBy(execUser.getUsername());
        orderHistoryMapper.insert(history);
    }

    @Override
    public boolean finishContact(Integer orderId) {
        //更新狀態
        orderMapper.finishContact(orderId);
        Order order = orderMapper.selectById(orderId);

        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());

        //通知客服
        String subject = photographer.getNickName() + " 攝影師，已聯繫客戶\n\n";
        String lineMsg = "訂單編號:" + order.getOrderNo() + "\n";
        lineMsg += "客戶:" + order.getCustomerName() + "\n";
        lineMsg += "電話:" + order.getCustomerPhone() + "\n";
        lineMsg += "拍攝日期:" + order.getShootingDate() + " " + order.getShootingTime() + "\n";
        triggerFlowLineNotify("finish_contact", subject, lineMsg);

        return true;
    }

    /**
     * 提醒攝影師聯繫客戶
     * @param
     */
    @Override
    public void contactRemind(Order order) {
        //email通知客服、攝影師

        if (order.getPhotographer().getEmail() != null && !"".equals(order.getPhotographer().getEmail())) {
            //email
            String content = order.getPhotographer().getNickName() + " 攝影師，提醒您與客戶聯繫<BR><BR>";
            content += "訂單編號：" + order.getOrderNo() + "<BR>";
            content += "客戶名稱：" + order.getCustomerName() + "<BR>";
            content += "客戶電話：" + order.getCustomerPhone() + "<BR>";
            content += "方便連絡的時間 ：" + order.getContactTime() + "<BR>";
            content += "客戶社群帳號：" + order.getSocial() + "(" + order.getSocialAccount() + ")<BR>";
            content += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + "<BR>";
            content += "＊備註：" + order.getExtraInfo() + "<BR><BR>";
            content += "若您已完成聯繫，請上系統進行回報或與客服人員回報，JoyShot感謝您的配合<BR><BR>";
            content += JS_PHOTOGRAPHER;

            mailUtil.sendHtmlEmail(order.getPhotographer().getEmail(),
                    EMAIL_BCC,
                    "【JoyShot 預約服務提醒通知】",
                    content );
        }

        String subject = "【JoyShot 預約服務提醒通知】\n\n";
        String lineMsg = order.getPhotographer().getNickName() + "攝影師，提醒您與客戶聯繫\n";
        lineMsg += "訂單編號：" + order.getOrderNo() + "\n";
        lineMsg += "客戶名稱：" + order.getCustomerName() + "\n";
        lineMsg += "客戶電話：" + order.getCustomerPhone() + "\n";
        lineMsg += "方便連絡的時間：" + order.getContactTime() + "\n";
        lineMsg += "客戶社群帳號：" + order.getSocial() + "(" + order.getSocialAccount() + ")\n";
        lineMsg += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + "\n";
        lineMsg += "＊備註：" +  order.getExtraInfo() + "\n\n";
        lineMsg += "若您已完成聯繫，請上系統進行回報或與客服人員回報，JoyShot感謝您的配合\n\n";
        lineMsg += JS_PHOTOGRAPHER;
        User user = userMapper.selectByPhId(order.getPhotographer().getId());
        if (user.getLineToken() != null && !"".equals(user.getLineToken())) {
            lineService.sendLineNotify(user.getLineToken(), subject + lineMsg);
        }
    }

    @Override
    public boolean finishTransfer(Integer orderId) {
        orderMapper.finishTransfer(orderId);

        Order order = orderMapper.selectById(orderId);
        Photographer photographer = photographerMapper.getPhotographerInfoByUuid(order.getPhUuid());

        String subject = "【JoyShot 款項匯入通知】\n\n";
        String lineMsg = photographer.getNickName() + " 攝影師，您的服務費已匯入您於系統登記的帳戶\n";
        lineMsg += "請即時查收確認。若有疑問，請聯繫JoyShot官方Line客服\n";
        lineMsg += "感謝您的配合\n\n";
        lineMsg += "訂單編號：" + order.getOrderNo() + "\n";
        lineMsg += "拍攝日期：" + order.getShootingDate() + " " + order.getShootingTime() + "\n\n";

        lineMsg += JS_PHOTOGRAPHER;
        User user = userMapper.selectByPhId(photographer.getId());
        if (user.getLineToken() != null && !"".equals(user.getLineToken())) {
            lineService.sendLineNotify(user.getLineToken(), subject + lineMsg);
        }
        return true;
    }

    @Override
    public void notifyBillingManager(List<Order> orders, String tomorrow) {

        StringBuffer sb = new StringBuffer();
        sb.append("<table>");
        sb.append("<tr>");
        sb.append("<td>no.</td>");
        sb.append("<td>訂單編號</td>");
        sb.append("<td>客戶</td>");
        sb.append("<td>拍攝日期</td>");
        sb.append("<td>拍攝時數</td>");
        sb.append("<td>攝影師</td>");
        sb.append("<td>銀行</td>");
        sb.append("<td>拍攝酬勞</td>");
        sb.append("<td>公里數</td>");
        sb.append("<td>交通費/客戶應付/客戶實付</td>");
        sb.append("<td>結帳日</td>");
        sb.append("</tr>");

        int counter = 1;
        for (Order order : orders) {
            PhotographerBank photographerBank = order.getPhotographerBank();
            sb.append("<tr>");
            sb.append("<td>" + counter + "</td>");
            sb.append("<td>" + order.getOrderNo() + "</td>");
            sb.append("<td>" + order.getCustomerName() + "</td>");
            sb.append("<td>" + order.getShootingDate() + " " + order.getShootingTime() + "</td>");
            sb.append("<td>" + order.getShootingDuration() + "</td>");
            sb.append("<td>" + order.getPhotographer().getName() + "(" + order.getPhotographer().getNickName() + ")</td>");
            sb.append("<td>" + photographerBank.getBankCode()+ " " + photographerBank.getBank() + " " + photographerBank.getBankBranch() + " " + photographerBank.getAccount() + " " + photographerBank.getName() + "</td>");
            sb.append("<td>" + order.getPhotographerProfit() + "</td>");
            sb.append("<td>" + order.getDistance() + "</td>");
            sb.append("<td>" + order.getTransportationFee()+"/"+order.getTransportationFeeOnCustomer()+"/"+order.getTransportationFeeCustomerActualPay() + "</td>");
            sb.append("<td>" + order.getPayDate() + "</td>");
            sb.append("</tr>");
            counter++;
        }
        sb.append("</table>");

        if (orders != null && orders.size() > 0) {
            mailUtil.sendReportHtmlEmail("service@joyshot.app",
                    EMAIL_BCC,
                    "【JoyShot帳務匯整】" + tomorrow,
                    sb.toString() );
        }
    }


    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public void cancelOrder(Order order) {
        orderMapper.cancelOrder(order.getId());
        Photographer photographer = photographerMapper.getPhotographerBasicByUuid(order.getPhUuid());
        photographerScheduleMapper.changeState(photographer.getId(), order.getShootingDate(), "Y");
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public Order updatePost(Order orderToChange, User execUser) {
        //先取得目前資料庫的資料
        Order orderInDb = orderMapper.findOrderWithPhotographer(orderToChange.getId());
        String diff = orderDiff(orderInDb, orderToChange);
        if (!"".equals(diff)) {
            //有變更攝影師
            if(!orderInDb.getPhUuid().equals(orderToChange.getPhUuid())) {
                //原攝影師的時段要release
                Integer phIdDb = orderInDb.getPhotographer().getId();
                photographerScheduleMapper.changeState(phIdDb, orderInDb.getShootingDate(), "Y");

                //新攝影師的時段要inactive
                Photographer newPhotographer = photographerMapper.getPhotographerInfoByUuid(orderToChange.getPhUuid());
                Integer phId = newPhotographer.getId();
                photographerScheduleMapper.changeState(phId, orderToChange.getShootingDate(), "N");
            }

            //有變更時數，重新計算攝影師獲利
            if(!orderInDb.getShootingDuration().equals(orderToChange.getShootingDuration())) {
                int photogrpherProfit = Integer.parseInt(dictMapper.selectPayForPhotographer()); //每小時給攝影師的費用
                orderToChange.setPhotographerProfit((int)(photogrpherProfit * orderToChange.getShootingDuration()));
            }
            this.saveOrUpdate(orderToChange);
        }

        //有變更，寫紀錄
        OrderHistory history = new OrderHistory();
        history.setOrderNo(orderToChange.getOrderNo());
        history.setOrderAction("更新訂單");
        history.setActionDetail(diff);
        history.setExecBy(execUser.getUsername());
        history.setUpdateNotes(orderToChange.getNotes());
        orderHistoryMapper.insert(history);

        return orderToChange;
    }

    private String orderDiff(Order orderInDb, Order orderToChange) {
        StringBuffer diff = new StringBuffer();
        if(!orderInDb.getPhUuid().equals(orderToChange.getPhUuid())) {
            diff.append("攝影師：" + orderInDb.getPhotographer().getNickName() + "->" + orderToChange.getPhotographer().getNickName() + "\n");
        }
        if(!orderInDb.getShootingDate().equals(orderToChange.getShootingDate())) {
            diff.append("拍攝日期：" + orderInDb.getShootingDate() + "->" + orderToChange.getShootingDate() + "\n");
        }
        if(!orderInDb.getShootingTime().equals(orderToChange.getShootingTime())) {
            diff.append("拍攝時間：" + orderInDb.getShootingTime() + "->" + orderToChange.getShootingTime() + "\n");
        }
        if(!orderInDb.getShootingDuration().equals(orderToChange.getShootingDuration())) {
            diff.append("拍攝時數：" + orderInDb.getShootingDuration() + "->" + orderToChange.getShootingDuration() + "\n");
        }
        if(!orderInDb.getShootingLocation().equals(orderToChange.getShootingLocation())) {
            diff.append("拍攝地點：" + orderInDb.getShootingLocation() + "->" + orderToChange.getShootingLocation() + "\n");
        }
        System.out.println("orderDiff:" + diff.toString());
        return diff.toString();
    }

    @Override
    @Transactional(rollbackFor = {ServiceException.class})
    public Order cancelPhotographerOrder(Order orderToChange, User execUser) {
        //先取得目前資料庫的資料
        Order orderInDb = orderMapper.findOrderWithPhotographer(orderToChange.getId());
        String diff = "訂單狀態：" + orderInDb.getStatus() + "->cancel";

        orderMapper.cancelPhotographerOrder(orderToChange.getId());

        //原攝影師的時段要release
        Integer phIdDb = orderInDb.getPhotographer().getId();
        photographerScheduleMapper.changeState(phIdDb, orderInDb.getShootingDate(), "Y");


        OrderHistory history = new OrderHistory();
        history.setOrderNo(orderToChange.getOrderNo());
        history.setOrderAction("取消訂單");
        history.setActionDetail(diff);
        history.setExecBy(execUser.getUsername());
        history.setUpdateNotes(orderToChange.getNotes());
        orderHistoryMapper.insert(history);

        return orderToChange;
    }

    @Override
    public void remindNotUpload(List<Order> orders) {
        //collect order info
        StringBuffer sb = new StringBuffer("\n");
        int counter = 1;
        for (Order order : orders) {
            sb.append(counter + ".\n");
            sb.append("訂單編號:" + order.getOrderNo() + "\n");
            sb.append("客戶:" + order.getCustomerName() + "\n");
            sb.append("拍攝日期:" + order.getShootingDate() + " " + order.getShootingTime() + " (" + order.getShootingDuration() + "小時)\n");
            sb.append("攝影師:" + order.getPhotographer().getName() + "(" + order.getPhotographer().getNickName() + ")\n\n");
            counter++;
        }

        if (orders.size() > 0) {
            triggerFlowLineNotify("photo_not_uploaded", "照片尚未上傳", sb.toString());
        }

    }
}




