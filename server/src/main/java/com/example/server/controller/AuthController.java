package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;

import com.example.server.dto.PasswordResetRequestDto;
import com.example.server.dto.ResetPasswordDto;
import com.example.server.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * API 1: Yêu cầu reset lại mật khẩu
     */
    @PostMapping("/password-reset")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDto request) {
        passwordResetService.handlePasswordResetRequest(request);
        return ResponseEntity.ok("Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.");
    }

    /**
     * API 2: Kiểm tra token
     */
    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam("token") String token) {
        boolean isValid = passwordResetService.isTokenValid(token);
        
        if (isValid) {
            return ResponseEntity.ok("Link đặt lại mật khẩu hợp lệ. Bạn có thể tiếp tục.");
        } else {
            return ResponseEntity.badRequest().body("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.");
        }
    }

    /**
     * API 3: Cập nhật mật khẩu mới
     */
    @PostMapping("/reset-password")
    public ResponseEntity<String> submitNewPassword(@Valid @RequestBody ResetPasswordDto request) {
        boolean success = passwordResetService.submitNewPassword(request);
        
        if (success) {
            return ResponseEntity.ok("Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.");
        } else {
            return ResponseEntity.badRequest().body("Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu link mới.");
        }
    }
}