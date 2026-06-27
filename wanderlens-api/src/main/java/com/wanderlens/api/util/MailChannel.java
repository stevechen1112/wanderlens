package com.wanderlens.api.util;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;

/**
 * Email 通知通道
 * - HTML / 純文字郵件
 * - dev-mode 時所有郵件改寄到 BCC 地址
 *
 * 實作 NotifyChannel 介面，recipient = Email 地址
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MailChannel implements NotifyChannel {

    private final JavaMailSender mailSender;

    @Value("${wanderlens.mail.dev-mode:true}")
    private boolean devMode;

    @Value("${wanderlens.mail.bcc:dev@wanderlens.app}")
    private String bccAddress;

    @Value("${spring.mail.username:noreply@wanderlens.app}")
    private String fromAddress;

    @Override
    public String getName() {
        return "EMAIL";
    }

    @Override
    public boolean isAvailable(String recipient) {
        return recipient != null && !recipient.isEmpty();
    }

    @Override
    public boolean send(String recipient, String message) {
        if (!isAvailable(recipient)) {
            return false;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(fromAddress);
            mail.setSubject("WanderLens 通知");

            if (devMode) {
                mail.setTo(bccAddress);
                mail.setText("（dev-mode 原收件者: " + recipient + "）\n\n" + message);
                log.info("[dev-mode] Email 改寄 BCC: to={}", recipient);
            } else {
                mail.setTo(recipient);
                mail.setText(message);
                log.info("Email 發送: to={}", recipient);
            }

            mailSender.send(mail);
            return true;
        } catch (Exception e) {
            log.error("Email 發送例外: to={}", recipient, e);
            return false;
        }
    }

    @Override
    public boolean sendWithImage(String recipient, String message, String imageUrl) {
        if (!isAvailable(recipient)) {
            return false;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setSubject("WanderLens 通知");

            String html = message;
            if (imageUrl != null && !imageUrl.isEmpty()) {
                html += "<br/><br/><img src='" + imageUrl + "' style='max-width:100%;'/>";
            }

            if (devMode) {
                helper.setTo(bccAddress);
                helper.setText("（dev-mode 原收件者: " + recipient + "）<br/><br/>" + html, true);
                log.info("[dev-mode] Email(HTML) 改寄 BCC: to={}", recipient);
            } else {
                helper.setTo(recipient);
                helper.setText(html, true);
                log.info("Email(HTML) 發送: to={}", recipient);
            }

            mailSender.send(mimeMessage);
            return true;
        } catch (Exception e) {
            log.error("Email(HTML) 發送例外: to={}", recipient, e);
            return false;
        }
    }
}