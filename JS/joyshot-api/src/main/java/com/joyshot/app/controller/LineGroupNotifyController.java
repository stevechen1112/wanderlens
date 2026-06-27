package com.joyshot.app.controller;

import com.joyshot.app.common.Result;
import com.joyshot.app.entity.LineMessage;
import com.joyshot.app.service.LineMessageService;
import com.joyshot.app.service.LineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/group-notify")
public class LineGroupNotifyController {


    @Autowired
    private LineMessageService lineMessageService;



    /**
     * 群發
     * @return
     * @throws IOException
     * @throws InterruptedException
     */
    @PostMapping
    public Result lineGroupNotifyMsg(@RequestBody LineMessage lineMessage) throws IOException {
        lineMessageService.lineGroupNotifyMsg(lineMessage);
        return Result.success();
    }


}
