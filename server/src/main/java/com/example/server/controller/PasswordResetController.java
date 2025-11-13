package com.example.server.controller;

import com.example.server.dto.PasswordResetRequestDto;
import com.example.server.dto.ResetPasswordDto;
import com.example.server.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password-reset")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * API 1: Yêu cầu reset mật khẩu
     * POST /api/password-reset/request
     */
    @PostMapping("/request")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDto request) {
        try {
            String message = passwordResetService.handlePasswordResetRequest(request);
            // Thành công trả về 200
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            // Email không tồn tại - trả về 404
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            // Lỗi server khác - trả về 500
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * API 2: Kiểm tra token có hợp lệ không
     * GET /api/password-reset/validate?token=xxx
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        try {
            boolean isValid = passwordResetService.isTokenValid(token);
            if (isValid) {
                return ResponseEntity.ok("Token hợp lệ");
            } else {
                return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * API 3: Submit mật khẩu mới
     * POST /api/password-reset/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitNewPassword(@Valid @RequestBody ResetPasswordDto request) {
        try {
            boolean success = passwordResetService.submitNewPassword(request);
            if (success) {
                return ResponseEntity.ok("Đổi mật khẩu thành công!");
            } else {
                return ResponseEntity.badRequest().body("Token không hợp lệ hoặc đã hết hạn");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
