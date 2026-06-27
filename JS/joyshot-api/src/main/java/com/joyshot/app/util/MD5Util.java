package com.joyshot.app.util;

import org.apache.commons.codec.digest.DigestUtils;

/**
 * @author avery
 */
public class MD5Util {

    private static final String SALT1 = "joyShot";
    private static final String SALT2 = "2023";

    public static String md5(String str) {
        return DigestUtils.md5Hex(str);
    }

    public static String encodedPassword(String originalPassword){
        return md5(SALT1 + originalPassword + SALT2);
    }

    public static void main(String[] args) {
        String originalPassword = "123123";
        System.out.println("password:" + originalPassword);
        System.out.println("password encoded:" + encodedPassword(originalPassword));
    }
}
