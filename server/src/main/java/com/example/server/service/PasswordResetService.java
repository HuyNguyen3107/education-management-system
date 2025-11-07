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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);

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
    public void handlePasswordResetRequest(PasswordResetRequestDto request) {
        String email = request.getEmail();
        logger.info("Nhận yêu cầu reset mật khẩu cho email: {}", email);

        // 1. Tìm user bằng email
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // 2. Tạo token
            String tokenString = UUID.randomUUID().toString();

            // 3. Tạo đối tượng token và lưu vào DB
            PasswordResetToken token = new PasswordResetToken(tokenString, user);
            tokenRepository.save(token);
            logger.info("Đã tạo token reset mật khẩu cho user ID: {}", user.getId());

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
        } else {
            logger.warn("Không tìm thấy user với email: {}", email);
            // Không tìm thấy email -> gửi thông báo (tùy chọn bảo mật)
            String emailBody = "Xin chào,\n\n" +
                             "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho địa chỉ email này, " +
                             "nhưng không tìm thấy tài khoản nào liên kết với email này trong hệ thống.\n\n" +
                             "Nếu bạn đã có tài khoản, vui lòng kiểm tra lại địa chỉ email hoặc liên hệ với bộ phận hỗ trợ.\n\n" +
                             "Trân trọng,\n" +
                             "Hệ thống Quản lý Giáo dục";
            emailService.sendEmail(email, "Yêu cầu Đặt lại Mật khẩu", emailBody);
        }
    }

    /**
     * Logic cho API 2: Kiểm tra token
     */
    public boolean isTokenValid(String token) {
        logger.debug("Kiểm tra tính hợp lệ của token");
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            logger.warn("Token không tồn tại");
            return false;
        }

        boolean expired = tokenOptional.get().isExpired();
        if (expired) {
            logger.warn("Token đã hết hạn");
        }
        return !expired;
    }

    /**
     * Logic cho API 3: Cập nhật mật khẩu
     */
    public boolean submitNewPassword(ResetPasswordDto request) {
        String token = request.getToken();
        logger.info("Nhận yêu cầu cập nhật mật khẩu với token");
        
        // 1. Kiểm tra token có hợp lệ không
        if (!isTokenValid(token)) {
            logger.error("Token không hợp lệ hoặc đã hết hạn");
            return false;
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        User user = tokenOptional.get().getUser();

        // 2. Lấy mật khẩu mới và mã hóa bằng BCrypt
        String newPassword = request.getNewPassword();
        String encodedPassword = passwordEncoder.encode(newPassword);

        // 3. Cập nhật mật khẩu đã mã hóa cho user
        user.setPasswordHash(encodedPassword);
        userRepository.save(user);
        logger.info("Đã cập nhật mật khẩu mới cho user ID: {}", user.getId());

        // 4. Xóa token đã dùng
        tokenRepository.delete(tokenOptional.get());
        logger.info("Đã xóa token sau khi sử dụng");

        return true;
    }
}