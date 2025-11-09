package com.example.server.repository;

import com.example.server.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {

    // Tìm token bằng chuỗi resetToken
    Optional<PasswordResetToken> findByResetToken(String resetToken);
}