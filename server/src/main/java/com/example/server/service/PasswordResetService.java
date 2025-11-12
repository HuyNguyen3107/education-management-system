package com.example.server.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.server.dto.PasswordResetRequestDto;
import com.example.server.dto.ResetPasswordDto;
import com.example.server.entity.User;
import com.example.server.entity.PasswordResetToken;
import com.example.server.repository.UserRepository;
import com.example.server.repository.PasswordResetTokenRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Logic cho API 1: Yêu cầu reset
     */
    public String handlePasswordResetRequest(PasswordResetRequestDto request) {
        String email = request.getEmail();

        // 1. Tìm user bằng email
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            return "Email không tồn tại trong hệ thống";
        }

        User user = userOptional.get();

        // 2. Tạo token
        String tokenString = UUID.randomUUID().toString();

        // 3. Tạo đối tượng token và lưu vào DB
        PasswordResetToken token = new PasswordResetToken(tokenString, user);
        tokenRepository.save(token);

        // 4. Gửi email với link reset
        String resetLink = "http://localhost:3000/reset-password?token=" + tokenString;
        String emailBody = "Xin chào,\n\n" +
                         "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới để tiếp tục:\n\n" +
                         resetLink + "\n\n" +
                         "Link này sẽ hết hạn sau 15 phút.\n\n" +
                         "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                         "Trân trọng,\n" +
                         "Hệ thống Quản lý Giáo dục";
        emailService.sendEmail(email, "Yêu cầu Đặt lại Mật khẩu", emailBody);

        return "Link reset mật khẩu đã được gửi đến email: " + email;
    }

    /**
     * Logic cho API 2: Kiểm tra token
     */
    public boolean isTokenValid(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByResetToken(token);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        return !tokenOptional.get().isExpired();
    }

    /**
     * Logic cho API 3: Cập nhật mật khẩu
     */
    public boolean submitNewPassword(ResetPasswordDto request) {
        String token = request.getToken();
        
        // 1. Kiểm tra token có hợp lệ không
        if (!isTokenValid(token)) {
            return false;
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByResetToken(token);
        User user = tokenOptional.get().getUser();

        // 2. Lấy mật khẩu mới và mã hóa bằng BCrypt
        String newPassword = request.getNewPassword();
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 3. Cập nhật mật khẩu đã mã hóa cho user
        user.setPasswordHash(encodedPassword);
        userRepository.save(user);

        // 4. Xóa token đã dùng
        tokenRepository.delete(tokenOptional.get());

        return true;
    }
}