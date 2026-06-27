package com.joyshot.app.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

/**
 * @author avery
 */
@Service
public class MailUtil {

    @Value("${spring.mail.username}")
    private String FROM_ADDRESS;

    @Value("${email.bcc}")
    private String BCC_ADDRESS;

    @Value("${email.dev-mode}")
    private String DEV_MODE;


    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String[] to, String subject, String body) throws MessagingException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_ADDRESS);
        if ("Y".equals(DEV_MODE)) {
            message.setTo(BCC_ADDRESS);
        } else {
            message.setTo(to);
        }

        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    @Async
    public void sendHtmlEmail(String to, String bcc, String subject, String htmlContent)  {
        try {
            System.out.println("sendHtmlEmail:" + to);
            if (to != null && !"".equals(to)) {
                MimeMessage message = mailSender.createMimeMessage();
                message.setFrom(FROM_ADDRESS);
                if ("Y".equals(DEV_MODE)) {
                    message.setRecipients(MimeMessage.RecipientType.TO, BCC_ADDRESS);
                } else {
                    message.setRecipients(MimeMessage.RecipientType.TO, to);

                    Address[] addresses = new Address[2];
                    Address address1 = new InternetAddress(bcc);
                    Address address2 = new InternetAddress("mr.fintech@gmail.com");
                    addresses[0] = address1;
                    addresses[1] = address2;
                    message.setRecipients(MimeMessage.RecipientType.BCC, addresses);
                }
                message.setSubject(subject);
                message.setContent(htmlContent, "text/html; charset=utf-8");
                mailSender.send(message);
            }
        } catch(Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendReportHtmlEmail(String to, String bcc, String subject, String htmlContent)  {
        try {
            System.out.println("sendReportHtmlEmail:" + to);
            if (to != null && !"".equals(to)) {
                MimeMessage message = mailSender.createMimeMessage();
                message.setFrom(FROM_ADDRESS);
                if ("Y".equals(DEV_MODE)) {
                    message.setRecipients(MimeMessage.RecipientType.TO, BCC_ADDRESS);
                } else {
                    message.setRecipients(MimeMessage.RecipientType.TO, to);
                }
                message.setSubject(subject);
//                message.setRecipients(MimeMessage.RecipientType.BCC, bcc);

                Address[] addresses = new Address[2];
                Address address1 = new InternetAddress(bcc);
                Address address2 = new InternetAddress("mr.fintech@gmail.com");
                addresses[0] = address1;
                addresses[1] = address2;

                message.setRecipients(MimeMessage.RecipientType.BCC, addresses);
                message.setContent(htmlContent, "text/html; charset=utf-8");
                mailSender.send(message);
            }
        } catch(Exception e) {
            System.out.println(e.getMessage());
            e.printStackTrace();
        }

    }
}
