package com.joyshot.app.exception;

import lombok.Getter;

/**
 * @author avery
 */
@Getter
public class ServiceException extends RuntimeException {

    private String code;

    public ServiceException(String code, String message) {
        super(message);
        this.code = code;
    }


}
