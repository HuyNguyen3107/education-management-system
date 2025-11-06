package com.example.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.dto.ResetRequest;
import com.example.server.dto.SubmitResetRequest;
import com.example.server.service.PasswordResetService;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * API 1: Yêu cầu reset lại mật khẩu
     * Người dùng sẽ gửi email của họ trong phần body
     */
    @PostMapping("/request-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestBody ResetRequest request) {
        passwordResetService.handlePasswordResetRequest(request);
        return ResponseEntity.ok("Yêu cầu reset đã được gửi (nếu email tồn tại).");
    }

    /**
     * API 2: Kiểm tra yêu cầu (token) còn hiệu lực hay không?
     * Người dùng sẽ gửi token trên đường dẫn (param)
     * Ví dụ: /api/auth/validate-token?token=abc123xyz
     */
    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestParam("token") String token) {
        boolean isValid = passwordResetService.isTokenValid(token);
        
        if (isValid) {
            return ResponseEntity.ok("Token hợp lệ.");
        } else {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc hết hạn.");
        }
    }

    /**
     * API 3: Cập nhật mật khẩu mới
     * Người dùng sẽ gửi token và mật khẩu mới trong phần body
     */
    @PostMapping("/submit-reset")
    public ResponseEntity<String> submitNewPassword(@RequestBody SubmitResetRequest request) {
        boolean success = passwordResetService.submitNewPassword(request);
        
        if (success) {
            return ResponseEntity.ok("Cập nhật mật khẩu thành công.");
        } else {
            return ResponseEntity.badRequest().body("Token không hợp lệ hoặc hết hạn.");
        }
    }
}