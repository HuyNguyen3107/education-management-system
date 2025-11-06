package com.example.server.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.server.dto.ResetRequest;
import com.example.server.dto.SubmitResetRequest;
import com.example.server.entity.User;
import com.example.server.entity.PasswordResetToken;
import com.example.server.repository.UserRepository;
import com.example.server.repository.PasswordResetTokenRepository;

import java.util.Optional;
import java.util.UUID;
@Service
public class PasswordResetService {

    // @Autowired
    // private EmailService emailService;

    @Autowired
    private UserRepository userRepository; // Tiêm repo User

    @Autowired
    private PasswordResetTokenRepository tokenRepository; // Tiêm repo Token

    /**
     * Logic cho API 1: Yêu cầu reset
     */
    public void handlePasswordResetRequest(ResetRequest request) {
        String email = request.getEmail();
        System.out.println("LOGIC: Tìm user với email: " + email);

        // 1. Tìm user bằng email
        Optional<User> userOptional = userRepository.findByEmail(email); // Giả sử bạn có hàm này
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 2. Tạo token
            String tokenString = UUID.randomUUID().toString();

            // 3. Tạo đối tượng token và lưu vào DB
            PasswordResetToken token = new PasswordResetToken(tokenString, user);
            tokenRepository.save(token);

            // 4. Gửi email (tạm thời comment để test)
            String resetLink = "http://localhost:3000/reset-password?token=" + tokenString;
            // emailService.sendEmail(email, "Yêu cầu Reset Mật khẩu", "Link reset: " + resetLink);
            System.out.println("LOGIC: Đã tạo token " + tokenString + " cho user " + email);
            System.out.println("Reset link: " + resetLink);
        } else {
            // Không tìm thấy email -> không làm gì cả
            System.out.println("LOGIC: Không tìm thấy email " + email);
        }
    }

    /**
     * Logic cho API 2: Kiểm tra token
     */
    public boolean isTokenValid(String token) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return false; // Không tìm thấy token
        }

        // Kiểm tra xem token có hết hạn chưa
        return !tokenOptional.get().isExpired();
    }

    /**
     * Logic cho API 3: Cập nhật mật khẩu
     */
    public boolean submitNewPassword(SubmitResetRequest request) {
        String token = request.getToken();
        // 1. Kiểm tra token có hợp lệ không
        if (!isTokenValid(token)) {
            return false; // Token không hợp lệ hoặc hết hạn
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        User user = tokenOptional.get().getUser();

        // 2. Lấy mật khẩu mới (tạm thời lưu plain text - nên thêm mã hóa sau)
        String newPassword = request.getNewPassword();

        // 3. Cập nhật mật khẩu mới cho user
        user.setPasswordHash(newPassword); // Sử dụng setPasswordHash thay vì setPassword
        userRepository.save(user);

        // 4. Xóa token đã dùng
        tokenRepository.delete(tokenOptional.get());

        
        return true; // Trả về true nếu thành công
    }
}