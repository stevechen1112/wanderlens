package com.joyshot.app.controller.dto;

import lombok.Data;

/**
 * @author avery
 * for frontend
 */
@Data
public class UserDTO {
    private String username;
    private String nickname;
    private String phone;
    private String password;
    private String role;
}
