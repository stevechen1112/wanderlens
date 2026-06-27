package com.joyshot.app;

import com.joyshot.app.util.MailUtil;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * @author avery
 */
public class LineMain {

    public static void main(String[] args) throws IOException {
        LineMain p = new LineMain();
        p.sendEmail();
    }

    private void sendEmail() {
        MailUtil mailUtil = new MailUtil();
        mailUtil.sendHtmlEmail("jamiejim1011@gmail.com",
                "service@joyshot.app,noreply@joyshot.app",
                "test",
                "<h1>joyshot...</h1>" );
    }

    private void checkDate() {
        Date date = new Date();

        DateTimeFormatter pattern = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");
        LocalDateTime now = LocalDateTime.from(date.toInstant().atZone(ZoneId.of("UTC+8")));
        System.out.println(now.format(pattern));

        LocalDateTime tomorrow = now.plusDays(1).plusHours(1);
        System.out.println(tomorrow.format(pattern));


    }




    private void line() throws IOException {
        URL url = new URL("https://notify-api.line.me/api/notify");
        HttpURLConnection http = (HttpURLConnection)url.openConnection();
        http.setRequestMethod("POST");
        http.setDoOutput(true);
        http.setDoInput(true);
        http.setRequestProperty("Authorization", "Bearer LC6sgjGhzMWfG5A5X4qWsMii1ALu1wnFCI56y0YEDha");
        http.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        String data = "message=完成124,,,";

        byte[] out = data.getBytes(StandardCharsets.UTF_8);
    }
}
