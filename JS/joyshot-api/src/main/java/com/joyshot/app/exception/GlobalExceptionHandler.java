package com.joyshot.app.exception;

import com.joyshot.app.common.Result;
import com.joyshot.app.util.ExceptionUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author avery
 */
@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Result error(Exception e){
        log.error(ExceptionUtils.getMessage(e));
        return Result.error();
    }
}
