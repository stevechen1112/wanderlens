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
@Controller
@RequestMapping("/api/line")
public class LineController {

    @Autowired
    private LineService lineService;

    @Autowired
    private LineMessageService lineMessageService;


    /**
     * 接受 Line 的回傳
     * @param request
     * @return
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping("/callback")
    public String callback(HttpServletRequest request) throws IOException, InterruptedException {
        String code = request.getParameter("code");
        String uid = request.getParameter("state");
        System.out.println("Line Access Code:" + code);
        System.out.println("Line Access state:" + uid);
        boolean result = lineService.getLineToken(code, uid);
        return "index";
//        return result ? Result.success() : Result.error(Status.CODE_ERROR, "get_line_auth_failed");
    }

    @GetMapping("/notify")
    public Result lineNotifyMsg(HttpServletRequest request,
                                @RequestParam String msg,
                                @RequestParam String token) throws IOException, InterruptedException {

//        String token = "LC6sgjGhzMWfG5A5X4qWsMii1ALu1wnFCI56y0YEDha";
        lineService.sendLineNotify(token, msg);
        return Result.success();
    }

    @GetMapping("/notify2")
    public Result lineNotifyMsg1(HttpServletRequest request) throws IOException, InterruptedException {
         String command =
                 "curl -H \"Authorization: Bearer LC6sgjGhzMWfG5A5X4qWsMii1ALu1wnFCI56y0YEDha\" -d \"message=完成,,,\" https://notify-api.line.me/api/notify";

//     try {
//         Process p = Runtime.getRuntime().exec(command);
//         p.waitFor();
//         BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
//         String line = "";
//         while ((line = reader.readLine())!= null)
//         {
//             output.append(line + "\n");
//         }
//
        return Result.success();
    }
}
