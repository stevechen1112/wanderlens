package com.joyshot.app.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.NotifyMessage;
import com.joyshot.app.entity.User;
import com.joyshot.app.mapper.NotifyMessageMapper;
import com.joyshot.app.service.NotifyMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/notify")
public class NotifyMessageController extends AppBaseController {

    @Autowired
    private NotifyMessageService notifyMessageService;

    @Autowired
    private NotifyMessageMapper notifyMessageMapper;


    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           HttpServletRequest request) {
        User execUser = getExecUser(request);

        IPage<NotifyMessage> page = new Page<>(pageNum, pageSize);
        QueryWrapper<NotifyMessage> query = new QueryWrapper<>();
        query.eq("message_owner", execUser.getId());
        query.eq("is_read", "N");
        query.orderByDesc("id");
        return Result.success(notifyMessageService.page(page, query));
    }

    @GetMapping("/unread")
    public Result findUnread(HttpServletRequest request) {
        User execUser = getExecUser(request);
        QueryWrapper<NotifyMessage> query = new QueryWrapper<>();
        query.eq("message_owner", execUser.getId());
        query.eq("is_read", "N");
        return Result.success(notifyMessageMapper.selectList(query));
    }

    @GetMapping("/set-read/{id}")
    public Result save(@PathVariable Integer id) {
        int result = notifyMessageMapper.setMessageRead(id);
        return result > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "update_read_failed");
    }


}
