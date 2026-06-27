package com.joyshot.app.controller;

import com.joyshot.app.common.Result;
import com.joyshot.app.controller.dto.SmsDTO;
import com.joyshot.app.util.SmsUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/sms-notify")
public class SmsController {

    @Autowired
    private SmsUtil smsUtil;

    @PostMapping
    public Result smsNotifyMsg(@RequestBody SmsDTO smsDTO) {
        System.out.println("smsNotifyMsg:" + smsDTO.getPhone());
        String phone = smsDTO.getPhone();
        String msg = smsDTO.getMsg();
        smsUtil.sendSms(phone, msg);
        return Result.success();
    }
}
