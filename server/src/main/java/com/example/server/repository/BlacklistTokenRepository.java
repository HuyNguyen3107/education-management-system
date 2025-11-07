package com.example.server.repository;

import com.example.server.entity.BlacklistToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface BlacklistTokenRepository extends JpaRepository<BlacklistToken, UUID> {
    boolean existsByToken(String token);
}
