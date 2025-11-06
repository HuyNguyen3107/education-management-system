package com.example.server.repository; // Gói của bạn

import com.example.server.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Hàm để tìm token bằng chuỗi token
    Optional<PasswordResetToken> findByToken(String token);
}