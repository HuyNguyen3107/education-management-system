package com.example.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Gửi email đơn giản
     * @param toEmail Email người nhận
     * @param subject Tiêu đề email
     * @param body Nội dung email
     * @return Message kết quả
     */
    public String sendEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            return "✅ Gửi email thành công đến: " + toEmail;
        } catch (Exception e) {
            return "❌ Không thể gửi email đến " + toEmail + ": " + e.getMessage();
        }
    }
}