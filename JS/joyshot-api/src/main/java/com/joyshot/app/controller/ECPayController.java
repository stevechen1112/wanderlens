package com.joyshot.app.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Ecpay;
import com.joyshot.app.entity.Role;
import com.joyshot.app.mapper.EcpayMapper;
import com.joyshot.app.mapper.MenuMapper;
import com.joyshot.app.mapper.RoleMapper;
import com.joyshot.app.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/ecpay")
public class ECPayController {

    @Autowired
    private EcpayMapper ecpayMapper;

    @GetMapping()
    public Result findPage(@RequestParam String hour) {
        Ecpay ecpay = ecpayMapper.selectByHour(hour);
        return ecpay != null ? Result.success(ecpay): Result.error(Status.CODE_500, "綠界支付連結未設定") ;
    }


}
