package com.example.server.repository;

import com.example.server.entity.AspirationRegister;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AspirationRegisterRepository extends JpaRepository<AspirationRegister, UUID> {
    List<AspirationRegister> findByStudentId(UUID studentId);
}
