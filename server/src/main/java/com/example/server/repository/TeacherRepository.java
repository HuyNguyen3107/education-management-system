package com.example.server.repository;

import com.example.server.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {
    boolean existsByTeacherCodeIgnoreCase(String teacherCode);

    java.util.Optional<Teacher> findByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
