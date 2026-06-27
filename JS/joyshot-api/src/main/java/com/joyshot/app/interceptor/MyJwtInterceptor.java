package com.joyshot.app.interceptor;

import cn.hutool.core.util.StrUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.joyshot.app.entity.User;
import com.joyshot.app.common.Status;
import com.joyshot.app.exception.ServiceException;
import com.joyshot.app.service.UserService;
import com.joyshot.app.util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author avery
 */

public class MyJwtInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        System.out.println("request getRequestURI:" + request.getRequestURI());

        //前端joyshot app使用
        String appToken = request.getHeader("apptoken");
        String token = request.getHeader("token");
        String locale = request.getHeader("locale");
        System.out.println("token:"+token + " appToken:"+appToken+" "+StrUtil.isBlank(appToken)+ " locale:"+locale);
        if (!StrUtil.isBlank(appToken)) {
            return true;
        } else {
            //後端
//            String token = request.getHeader("token");
            if (!(handler instanceof HandlerMethod)) {
                return true;
            }
            if (StrUtil.isBlank(token)) {
                throw new ServiceException(Status.CODE_ERROR, "no_token");
            }

            String empno;
            try {
                empno = JWT.decode(token).getAudience().get(0);
            } catch (JWTDecodeException jex) {
                throw new ServiceException(Status.CODE_ERROR, "token_not_valid");
            }

            QueryWrapper<User> query = new QueryWrapper<>();
            query.eq("empno", empno);
            User user = userService.getOne(query);
            if (user == null) {
                throw new ServiceException(Status.CODE_ERROR, "user_not_found");
            }

            //token是用帳號與加密過後的密碼去產生，所以可以直接取資料庫的密碼來驗證
            String passwordInDb = user.getPassword();
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(passwordInDb)).build();
            try {
                verifier.verify(token);

            } catch (JWTVerificationException jex) {
                System.out.println("JWTVerificationException:"+jex);
                jex.printStackTrace();
                throw new ServiceException(Status.CODE_ERROR, "token_verify_error");
            }
            return true;
        }
    }
}
