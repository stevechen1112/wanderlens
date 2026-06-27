package com.joyshot.app.controller;


import cn.hutool.core.util.StrUtil;
import cn.hutool.log.Log;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.joyshot.app.controller.dto.UserPasswordChangeDTO;
import com.joyshot.app.mapper.UserMapper;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.ActionLog;
import com.joyshot.app.entity.GroupByDTO;
import com.joyshot.app.entity.Menu;
import com.joyshot.app.entity.User;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.RoleMenuMapper;
import com.joyshot.app.service.ActionLogService;
import com.joyshot.app.service.UserService;
import com.joyshot.app.util.MD5Util;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * @author avery
 */
@RestController
@RequestMapping("/api/user")
@Api(tags = "UserController")
public class UserController extends AppBaseController {

    private static final Log logger = Log.get();

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMenuMapper roleMenuMapper;

    @Autowired
    private ActionLogService actionLogService;


    @GetMapping
    public Result findAll() {
        System.out.println("findAll...");
        return Result.success(userMapper.selectList(null));
    }

    @GetMapping("/page")
    public Result findPage(@RequestParam Integer pageNum,
                           @RequestParam Integer pageSize,
                           @RequestParam String queryField,
                           @RequestParam String keyword) {
        IPage<User> page = new Page<>(pageNum, pageSize);
//        QueryWrapper<User> query = new QueryWrapper<>();
//        if (!StrUtil.isBlank(queryField)) {
//            query.like(queryField, keyword);
//        }
//        query.orderByDesc("id");
        IPage<User> userIPage;
        try {
            userIPage = userService.page(page, queryField, keyword);
        } catch (Exception e) {
            return Result.error(Status.CODE_ERROR, e.getMessage());
        }

        return Result.success(userIPage);
    }

    /**
     * @RequestBody: 把json轉成object
     **/
    @PostMapping
    public Result save(@RequestBody User user) {
        //新增的時候才有傳 password，才需轉換
        //修改的時候，前台不開放修改，所以不去更新password
        if (user.getPassword() != null) {
            String md5Password = MD5Util.encodedPassword(user.getPassword());
            user.setPassword(md5Password);
        }

        boolean result = userService.saveOrUpdate(user);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "save_failed");
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        int i = userMapper.deleteById(id);
        return i > 0 ? Result.success() : Result.error(Status.CODE_ERROR, "delete_failed");
    }

    @GetMapping("/export")
    public void export(HttpServletResponse response) throws Exception {
        List<User> users = userMapper.selectList(null);
        ExcelWriter writer = ExcelUtil.getWriter(true);
        writer.addHeaderAlias("empno", "工號");
        writer.addHeaderAlias("username", "名稱");
        writer.addHeaderAlias("phone", "聯絡電話");
        writer.setOnlyAlias(true);
        writer.write(users, true);

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8");
        String fileName = URLEncoder.encode("資料", "UTF-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");

        ServletOutputStream outputStream = response.getOutputStream();
        writer.flush(outputStream, true);
        outputStream.close();
        writer.close();
    }

    @PostMapping("/imp")
    public boolean importData(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        List<List<Object>> lists = ExcelUtil.getReader(inputStream).read(1);
        ArrayList<User> saveList = new ArrayList<>();
        for (List<Object> row : lists) {
            User user = new User();
            user.setUsername(row.get(0).toString());
            user.setUsername(row.get(1).toString());
            user.setPhone(row.get(3).toString());
            saveList.add(user);
        }
        boolean b = userService.saveBatch(saveList);
        return b;
    }

    @PostMapping("/login")
    public Result login(@RequestBody User user, HttpServletRequest request) {
        String empno = user.getEmpno();
        String password = user.getPassword();
        if (StrUtil.isBlank(empno) || StrUtil.isBlank(password)) {
            return Result.error(Status.CODE_ERROR, Status.VALIDATION_ERROR);
        }
        // if user not found, exception occurred.
        User userFound = userService.doLogin(user);
        if (userFound == null) {
            throw new ServiceException(Status.CODE_ERROR, "user_not_found");
        }

        // no exception, return success
        return Result.success(userFound);
    }


    @PostMapping("/info")
    public Result selectByUserToken(@RequestBody User user) {
        User userFound = userMapper.selectByUserToken(user.getToken());
        return (userFound != null) ? Result.success(userFound) : Result.error(Status.CODE_ERROR, "user_token_not_found");
    }

    @GetMapping("/mgr")
    public Result selectManagerUser() {
        List<User> userFound = userMapper.selectManagerUser();
        return (userFound != null) ? Result.success(userFound) : Result.error(Status.CODE_ERROR, "find_manager_error");
    }

    @GetMapping("/sales")
    public Result selectSalesUser() {
        List<User> userFound = userMapper.selectSalesUser();
        return (userFound != null) ? Result.success(userFound) : Result.error(Status.CODE_ERROR, "find_sales_error");
    }

    @GetMapping("/log")
    public Result getMyAction(HttpServletRequest request) {
        User execUser = getExecUser(request);

        IPage<ActionLog> page = new Page<>(1, 5);
        QueryWrapper<ActionLog> query = new QueryWrapper<>();
        query.eq("user_id", execUser.getId() + "");
        query.orderByDesc("id");
        return Result.success(actionLogService.page(page, query));
    }

    @GetMapping("/logout")
    public Result doLogout(HttpServletRequest request) {
        User execUser = getExecUser(request);
        userService.doLogout(execUser);

        return Result.success();
    }

    @GetMapping("/shortcut")
    public Result getUserMenuShortCut(HttpServletRequest request) {
        User execUser = getExecUser(request);
        Integer roleId = execUser.getRoleId();
        List<Menu> menu = roleMenuMapper.selectMenuShortCut(roleId);

        return (menu != null) ? Result.success(menu) : Result.error(Status.CODE_ERROR, "find_menu_shortcut_error");
    }

    @GetMapping("/groupby")
    public Result findGroupby() {
        List<GroupByDTO> data = userMapper.selectGroupByType();

        return Result.success(data);
    }

    @GetMapping("/q")
    public Result getUserByCritieria(@RequestParam String keyword) {
        QueryWrapper<User> query = new QueryWrapper<>();
        query.like("username", keyword);
        query.or();
        query.like("empno", keyword);
        return Result.success(userMapper.selectList(query));
    }

    /**
     * @RequestBody: 變更密碼
     **/
    @PostMapping("/change-password")
    public Result changePassword(@RequestBody UserPasswordChangeDTO dto) {
        boolean result = userService.changePassword(dto);
        return result ? Result.success() : Result.error(Status.CODE_ERROR, "old_password_not_correct");
    }

    /**
     * 檢查帳號是否已存在
     **/
    @GetMapping("/account/exists")
    public Result checkEmpNoExist(@RequestParam String empno) {
        User user = userMapper.findByEmpno(empno);
        return user == null ? Result.success() : Result.error(Status.CODE_ERROR, "account_exist");
    }



}
