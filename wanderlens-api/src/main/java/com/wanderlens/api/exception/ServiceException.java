package com.wanderlens.api.exception;

import lombok.Getter;
import com.wanderlens.api.common.ResultCode;

/**
 * 業務例外
 */
@Getter
public class ServiceException extends RuntimeException {

    private final String code;

    public ServiceException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }

    public ServiceException(ResultCode resultCode, String message) {
        super(message);
        this.code = resultCode.getCode();
    }

    public ServiceException(String code, String message) {
        super(message);
        this.code = code;
    }
}