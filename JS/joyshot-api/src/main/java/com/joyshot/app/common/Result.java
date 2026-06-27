package com.joyshot.app.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author avery
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    private String code;
    private String message;
    private Object data;

    public static Result success() {
        return new Result(Status.CODE_200, "ok", null);
    }

    public static Result success(Object data) {
        return new Result(Status.CODE_200, "ok", data);
    }

    public static Result warning401(Object data) {
        return new Result(Status.CODE_401, "ok", data);
    }

    public static Result error(String code, String msg) {
        return new Result(code, msg, null);
    }

    public static Result error() {
        return new Result(Status.CODE_500, "system error", null);
    }


}
