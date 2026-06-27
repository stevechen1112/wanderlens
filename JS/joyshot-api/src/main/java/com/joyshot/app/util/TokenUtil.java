package com.joyshot.app.util;


import cn.hutool.core.date.DateUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;

/**
 * @author avery
 */
public class TokenUtil {

    public static String generateToken(String empno, String pwd) {
        return JWT.create().withAudience(empno)
                // token invalid after 8 hours
                .withExpiresAt(DateUtil.offsetHour(new Date(), 8))
                .sign(Algorithm.HMAC256(pwd));
    }

}
