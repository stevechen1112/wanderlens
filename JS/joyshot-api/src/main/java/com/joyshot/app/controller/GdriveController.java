package com.joyshot.app.controller;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;
import com.joyshot.app.common.Result;
import com.joyshot.app.common.Status;
import com.joyshot.app.util.GdriverUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.List;

/**
 * @author avery
 */
@Controller
@RequestMapping("/api/googledrive")
public class GdriveController {

    @Autowired
    private GdriverUtil gdriverUtil;

    @GetMapping("/signin")
    public void googleSignIn(HttpServletResponse response) throws IOException {
        if (!gdriverUtil.beenSignin()) {
            String redirectURL = gdriverUtil.getRediretUrl();
            response.sendRedirect(redirectURL);
        } else {
            System.out.println("已經認證過");
        }
    }

    @GetMapping("/oauth")
    public String saveAuthCode(HttpServletRequest request) throws IOException {
        String code = request.getParameter("code");
        System.out.println("saveAuthCode:" + code);
        if (code != null) {
            gdriverUtil.saveToken(code);
            return "gdrive";
        }
        return "error";
    }

    @ResponseBody
    @GetMapping(value="/signin-status", produces = "application/json")
    public Result status(HttpServletRequest request) throws IOException {
        return gdriverUtil.beenSignin()? Result.success() : Result.error(Status.CODE_ERROR, "google_not_signin");
    }





}
