package com.joyshot.app.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.joyshot.app.common.Status;
import com.joyshot.app.entity.User;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * @author avery
 */

@Component
public class AppBaseController {

    @Autowired
    private UserMapper userMapper;



    /**
     * 從token裡，回找執行此api的人員
     *
     * @param request
     * @return
     */
    public User getExecUser(HttpServletRequest request) {
        String token = request.getHeader("token");
        return getExecUserByToken(token);
    }

    public User getExecUserByToken(String token) {
        String empno = "";
        try {
            empno = JWT.decode(token).getAudience().get(0);
        } catch (JWTDecodeException jex) {
            throw new ServiceException(Status.CODE_ERROR, "token_not_valid");
        }

        User user = userMapper.selectUserByEmpno(empno);
        return user;
    }

}
