package com.example.server.service;

import com.example.server.dto.LoginRequest;
import com.example.server.dto.LoginResponse;
import com.example.server.entity.BlacklistToken;
import com.example.server.entity.User;
import com.example.server.repository.BlacklistTokenRepository;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BlacklistTokenRepository blacklistTokenRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository,
            BlacklistTokenRepository blacklistTokenRepository,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.blacklistTokenRepository = blacklistTokenRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // ✅ Validate dữ liệu đầu vào
        StringBuilder errorMessage = new StringBuilder();

        if (email == null || email.trim().isEmpty()) {
            errorMessage.append("Vui lòng nhập email. ");
        } else if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            errorMessage.append("Vui lòng nhập đúng định dạng email. ");
        }

        if (password == null || password.trim().isEmpty()) {
            errorMessage.append("Vui lòng nhập mật khẩu. ");
        } else if (password.length() < 8) {
            errorMessage.append("Mật khẩu phải có ít nhất 8 ký tự. ");
        }

        if (!errorMessage.isEmpty()) {
            throw new RuntimeException(errorMessage.toString().trim());
        }

        // ✅ Kiểm tra thông tin tài khoản
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không chính xác");
        }

        // ✅ Sinh JWT token
        String token = jwtService.generateToken(user);

        // ✅ Cập nhật trạng thái online
        user.setOnline(true);
        userRepository.save(user);

        // ✅ Ẩn mật khẩu trước khi trả về
        user.setPasswordHash(null);

        // ✅ Trả về LoginResponse
        return new LoginResponse(
                token,
                "Đăng nhập thành công",
                user.getId().toString(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getDateOfBirth(),
                user.getGender(),
                user.getAddress(),
                user.getStatus(),
                user.getAcademicYear(),
                user.getEducationLevel(),
                user.isOnline(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString());
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);

            // ✅ Nếu token chưa bị thu hồi thì thêm vào blacklist
            if (!blacklistTokenRepository.existsByToken(token)) {
                blacklistTokenRepository.save(new BlacklistToken(token));
            }

            // ✅ Lấy email từ token
            String email = jwtService.extractUsername(token);

            // ✅ Cập nhật trạng thái offline
            userRepository.findByEmail(email).ifPresent(u -> {
                u.setOnline(false);
                userRepository.save(u);
            });
        }
    }
}
