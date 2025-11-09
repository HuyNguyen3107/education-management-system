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
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Kiểm tra mật khẩu (hash hoặc plain text, tùy DB)
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())
                && !request.getPassword().equals(user.getPasswordHash())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        // Sinh JWT token
        String token = jwtService.generateToken(user);

        // Cập nhật trạng thái online
        user.setOnline(true);
        userRepository.save(user);

        // Ẩn mật khẩu khi trả về
        user.setPasswordHash(null);

        // ✅ Trả về LoginResponse mới
        return new LoginResponse(token, user);
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);

            // Nếu token chưa bị thu hồi thì thêm vào blacklist
            if (!blacklistTokenRepository.existsByToken(token)) {
                blacklistTokenRepository.save(new BlacklistToken(token));
            }

            // Lấy email từ token (JWT subject chính là email)
            String email = jwtService.extractUsername(token);

            // Cập nhật trạng thái offline
            userRepository.findByEmail(email).ifPresent(u -> {
                u.setOnline(false);
                userRepository.save(u);
            });
        }
    }
}
