package com.wanderlens.api.entity.dto;

import lombok.Data;

/**
 * 登入回應 DTO
 */
@Data
public class LoginResponse {

    private String token;
    private Long userId;
    /** 供給方主鍵（攝影師/造型師）。一般使用者為 null。可能與 userId 不同。 */
    private Long providerId;
    private String empno;
    private String username;
    private String role;
    private String avatar;

    public LoginResponse(String token, Long userId, Long providerId, String empno, String username, String role, String avatar) {
        this.token = token;
        this.userId = userId;
        this.providerId = providerId;
        this.empno = empno;
        this.username = username;
        this.role = role;
        this.avatar = avatar;
    }
}