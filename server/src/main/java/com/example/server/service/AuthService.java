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

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())
                && !request.getPassword().equals(user.getPasswordHash())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        String token = jwtService.generateToken(user.getEmail());
        user.setIsOnline(true);
        userRepository.save(user);

        return new LoginResponse("Đăng nhập thành công", token);
    }

    public void logout(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (!blacklistTokenRepository.existsByToken(token)) {
                blacklistTokenRepository.save(new BlacklistToken(token));
            }

            String email = jwtService.extractEmail(token);
            userRepository.findByEmail(email).ifPresent(u -> {
                u.setIsOnline(false);
                userRepository.save(u);
            });
        }
    }
}
