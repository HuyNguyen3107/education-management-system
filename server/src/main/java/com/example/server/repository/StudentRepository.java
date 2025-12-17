package com.example.server.repository;

import com.example.server.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository extends JpaRepository<Student, UUID> {

    // Tìm sinh viên theo mã sinh viên

    Optional<Student> findByStudentCode(String studentCode);

    // Tìm sinh viên theo user_id

    Optional<Student> findByUserId(UUID userId);

    // Tìm sinh viên theo class_id
    java.util.List<Student> findByClassId(UUID classId);
}
