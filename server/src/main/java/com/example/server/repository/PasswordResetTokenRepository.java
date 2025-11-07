package com.example.server.repository;

import com.example.server.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    // Tìm token bằng chuỗi token (Spring JPA sẽ map theo tên field 'token' trong entity)
    Optional<PasswordResetToken> findByToken(String token);
}