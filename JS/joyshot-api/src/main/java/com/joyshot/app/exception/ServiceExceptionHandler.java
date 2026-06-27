package com.joyshot.app.exception;

import com.joyshot.app.common.Result;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author avery
 */
@ControllerAdvice
public class ServiceExceptionHandler {

    @ExceptionHandler(ServiceException.class)
    @ResponseBody
    public Result handle(ServiceException se) {
        return Result.error(se.getCode(), se.getMessage());
    }

}
