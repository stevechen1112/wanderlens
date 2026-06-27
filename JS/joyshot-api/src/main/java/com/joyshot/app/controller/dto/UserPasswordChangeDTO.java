package com.joyshot.app.controller.dto;

import lombok.Data;

/**
 * @author avery
 */
@Data
public class UserPasswordChangeDTO {

    private Integer id;
    private String oldPassword;
    private String newPassword;

}
