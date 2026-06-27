package com.wanderlens.api.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * JWT 工具類
 * - 使用獨立密鑰（非使用者密碼），取代 JS 的不安全設計
 */
@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration:28800}")
    private long expirationSeconds;

    /**
     * 產生 JWT Token
     *
     * @param userId   使用者 ID
     * @param empno    登入帳號
     * @param role     角色
     * @return JWT token
     */
    public String generateToken(Long userId, String empno, String role) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withClaim("empno", empno)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationSeconds * 1000))
                .sign(algorithm);
    }

    /**
     * 驗證並解析 JWT Token
     *
     * @param token JWT token
     * @return DecodedJWT
     */
    public DecodedJWT verifyToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.require(algorithm)
                .build()
                .verify(token);
    }

    /**
     * 從 token 取出 userId
     */
    public Long getUserId(String token) {
        DecodedJWT jwt = verifyToken(token);
        return Long.parseLong(jwt.getSubject());
    }

    /**
     * 從 token 取出 empno
     */
    public String getEmpno(String token) {
        return verifyToken(token).getClaim("empno").asString();
    }

    /**
     * 從 token 取出 role
     */
    public String getRole(String token) {
        return verifyToken(token).getClaim("role").asString();
    }
}