package com.joyshot.app.service;

import com.joyshot.app.entity.FileRepo;
import com.joyshot.app.entity.User;
import com.joyshot.app.mapper.UserMapper;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.util.List;

/**
 * @author avery
 */
@Service
public class LineService {

    @Value("${line.callback-url}")
    private String LINE_CALLBACK_URL;

    @Value("${line.oauth-token-url}")
    private String LINE_OAUTH_TOKEN_URL;

    @Value("${line.notify-url}")
    private String LINE_NOTIFY_URL;

    @Value("${line.client-id}")
    private String LINE_CLIENT_ID;

    @Value("${line.client-secret}")
    private String LINE_CLIENT_SECRET;

    @Value("${file.upload-location}")
    private String LINE_IMAGE_PATH;

    @Value("${email.js-photographer}")
    private String PHOTOGRAPHER_URL;

    @Autowired
    private UserMapper userMapper;

    /**
     * 取授權碼
     * @param
     * @return
     */
    public boolean getLineToken(String code, String uid) {

        //拿code去line授權
        //curl -d "grant_type=authorization_code&redirect_uri=http://linenotify.lh-decor.com:33168/callback&client_id=" + LINE_CLIENT_ID + "&client_secret=CB6AkATfNtbv9MKdRcCSB21Brp5lpsMuOhryzk0geLp&code=vSrFwE4ns0ZnNTaBb8TWjp" https://notify-bot.line.me/oauth/token
        String[] command = { "curl", "-d", "grant_type=authorization_code&redirect_uri=" + LINE_CALLBACK_URL + "&client_id=" + LINE_CLIENT_ID + "&client_secret=" + LINE_CLIENT_SECRET + "&code=" + code, LINE_OAUTH_TOKEN_URL };

        ProcessBuilder process = new ProcessBuilder(command);
        Process p;
        try {
            p = process.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line = null;
            String accessToken = "";
            while ((line = reader.readLine()) != null) {
                System.out.println("line:" + line);
                if (line != null && line.indexOf("access_token") != -1) {
                    //去空白
                    accessToken = line.replace(" ","");
                    accessToken = accessToken.substring(accessToken.indexOf(":") + 1);
                    accessToken = accessToken.replace("\"","");
                }
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }

            System.out.println("access_token=" + accessToken + "#");
            sendLineNotify(accessToken, "授權完成");
            //"access_token" : "LC6sgjGhzMWfG5A5X4qWsMii1ALu1wnFCI56y0YEDha"

            User user = userMapper.selectUserById(Integer.parseInt(uid));
            user.setLineAuthCode(code);
            user.setLineToken(accessToken);
            int i = userMapper.updateById(user);

            return true;

        } catch(IOException e) {
            e.printStackTrace();
            return false;
        }

    }

    public void sendLineNotify(String token, String message) {
        System.out.println("sendLineNotify:" + message );
        String[] command = { "curl", "-H", "Authorization: Bearer " + token, "-d", "message="+message, LINE_NOTIFY_URL };

        ProcessBuilder process = new ProcessBuilder(command);
        Process p;
        try {
            p = process.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line = null;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }
            String result = builder.toString();
            System.out.print("sendLineNotify:" + result);

        } catch(IOException e) {
            System.out.print("IOException:" + e.getMessage());
            e.printStackTrace();
        }

    }

    @Async
    public void sendGroupNotify(String message, FileRepo fileRepo, List<User> photographers) throws IOException {
//        String filePath = "@" + LINE_IMAGE_PATH + fileRepo.getUrl();
//        System.out.println(filePath);
        for (User user : photographers) {
            String token = user.getLineToken();
//            System.out.println("token:" + token);
            if (token == null || "".equals(token)) {
                continue;
            }


            String[] command = null;
            if (fileRepo != null) {
                command = new String[]{"curl", "-H", "Authorization: Bearer " + token, "-F", "message=" + message, "-F", "imageFile=@"+LINE_IMAGE_PATH+fileRepo.getUrl(), LINE_NOTIFY_URL};
            } else {
                command = new String[]{ "curl", "-H", "Authorization: Bearer " + token, "-F", "message="+message, LINE_NOTIFY_URL };
            }

            ProcessBuilder process = new ProcessBuilder(command);
            Process p;
            try {
                p = process.start();
                BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
                StringBuilder builder = new StringBuilder();
                String line = null;
                while ((line = reader.readLine()) != null) {
                    builder.append(line);
                    builder.append(System.getProperty("line.separator"));
                }
                String result = builder.toString();
                System.out.print("sendLineNotify:" + result);

            } catch(IOException e) {
                System.out.print("IOException:" + e.getMessage());
                e.printStackTrace();
            }
        }


    }

    @Async
    public void notifyPhotographerToUpdateSchedule(List<User> users) {
        for (User user : users) {
            String token = user.getLineToken();
            if (token == null || "".equals(token)) {
                continue;
            }
            String message = "\n" + user.getUsername() + " 攝影師，提醒您記得去更新本月或下個月的拍攝時段哦\n\n";
            message += PHOTOGRAPHER_URL;

            String[] command = command = new String[]{ "curl", "-H", "Authorization: Bearer " + token, "-F", "message="+message, LINE_NOTIFY_URL };

            ProcessBuilder process = new ProcessBuilder(command);
            Process p;
            try {
                p = process.start();
                BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
                StringBuilder builder = new StringBuilder();
                String line = null;
                while ((line = reader.readLine()) != null) {
                    builder.append(line);
                    builder.append(System.getProperty("line.separator"));
                }
                String result = builder.toString();
                System.out.println("notifyPhotographerToUpdateSchedule:" + result);

            } catch(IOException e) {
                System.out.println("IOException:" + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
