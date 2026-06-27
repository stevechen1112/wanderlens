package com.joyshot.app.util;

import com.google.common.collect.Lists;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.StringUtils;

import java.io.*;
import java.net.*;
import java.util.List;

/**
 * @author avery
 */
@Service
public class SmsUtil {

    @Value("${sms.url}")
    private String SMS_URL;

    @Value("${sms.username}")
    private String SMS_USERNAME;

    @Value("${sms.password}")
    private String SMS_PASSWORD;

    @Value("${twillio.account-sid}")
    private String TWILIO_ACCOUNT_SID;

    @Value("${twillio.auth-token}")
    private String TWILIO_AUTH_TOKEN;

    @Value("${twillio.phone-from}")
    private String TWILIO_PHONE_FROM;

    @Value("${spring.profiles.active}")
    private String CURRENT_MODE;

    public void twillioSms(String phone, String sms) {
        Twilio.init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        Message.creator(new PhoneNumber("+886"+phone), new PhoneNumber(TWILIO_PHONE_FROM), sms).create();
    }

    @Async
    public void sendSms(String phone, String sms) {
        try {
            System.out.println("發送簡訊");
            System.out.println("phone:" + phone);
            System.out.println("sms:" + sms);

            if (phone != null && !"".equals(phone)) {
                if ("dev".equals(CURRENT_MODE)) {
                    twillioSms(phone, sms);
                } else {
                    String body = URLEncoder.encode(sms, "UTF-8");
                    StringBuffer reqUrl = new StringBuffer();
                    reqUrl.append(SMS_URL);
                    reqUrl.append("CharsetURL=UTF8");
                    reqUrl.append("&username=" + SMS_USERNAME);
                    reqUrl.append("&password=" + SMS_PASSWORD);
                    reqUrl.append("&dstaddr=" + phone);
                    reqUrl.append("&smbody=" + body);

                    URL obj = new URL(reqUrl.toString());
                    BufferedReader bufferedReader = null;
                    HttpURLConnection con = (HttpURLConnection) obj.openConnection();

                    // optional default is GET
                    con.setRequestMethod("GET");
                    int responseCode = con.getResponseCode();
                    System.out.println("responseCode:" + responseCode);

                    bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));
                    String inputLine = "";
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = bufferedReader.readLine()) != null) {
                        response.append(inputLine);
                    }

                    // print result
                    String responseStr = response.toString();
                    System.out.println("responseStr:" + responseStr);

                    int from = responseStr.indexOf("statuscode=");
                    int to = responseStr.indexOf("AccountPoint=");
                    String tmpStr = StringUtils.substring(responseStr, from, to);

                    // 取得status code
                    String statusCode = StringUtils.substring(tmpStr, tmpStr.length() - 1, tmpStr.length());
                    System.out.println("statusCode = " + statusCode);

                    // 將status code 轉成 中文訊息
                    String executionResult = getDescription(statusCode);
                    System.out.println("executionResult = " + executionResult);

                    List<String> successList = Lists.newArrayList("0", "1", "2", "3", "4"); // 成功的SATUSCODE
                    if (!successList.contains(statusCode)) {
                        throw new RuntimeException(executionResult);
                    }
                    System.out.println("發簡訊給客戶:" + phone);
                }
            }
        } catch (MalformedURLException e) {
            System.out.println("簡訊發送失敗:MalformedURLException:" + e.getMessage());
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            System.out.println("簡訊發送失敗:UnsupportedEncodingException:" + e.getMessage());
            e.printStackTrace();
        } catch (ProtocolException e) {
            System.out.println("簡訊發送失敗:ProtocolException:" + e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("簡訊發送失敗:IOException:" + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getDescription(String statusCode) {
        String description = "";
        for (SmsStatusCodeEnum smsStatusCode : SmsStatusCodeEnum.values()) {
            if (smsStatusCode.getCode().equals(statusCode)) {
                description = smsStatusCode.getDescription();
            }
        }
        return description;
    }
}
