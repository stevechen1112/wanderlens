package com.joyshot.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.Area;
import com.joyshot.app.entity.AreaZipcode;
import com.joyshot.app.mapper.AreaMapper;
import com.joyshot.app.mapper.AreaZipcodeMapper;
import com.joyshot.app.mapper.PhotographerMapper;
import com.joyshot.app.service.AreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/area-zipcode")
public class AreaZipcodeController {



    @Autowired
    private AreaZipcodeMapper areaZipcodeMapper;

    @GetMapping("/{zipcode}")
    public Result find(@PathVariable String zipcode) {
        AreaZipcode areaZipcode = areaZipcodeMapper.findAreaZipcode(zipcode);
        return areaZipcode != null ? Result.success(areaZipcode) : Result.error(Status.CODE_ERROR, "查無縣市鄉鎮資料");
    }




}
