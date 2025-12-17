package com.example.server.repository;

import com.example.server.entity.StudentMajor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentMajorRepository extends JpaRepository<StudentMajor, UUID> {
    List<StudentMajor> findByStudentId(UUID studentId);

    List<StudentMajor> findByMajorId(UUID majorId);

    List<StudentMajor> findBySpecializationId(UUID specializationId);

    boolean existsByStudentId(UUID studentId);

    boolean existsByStudentIdAndMajorId(UUID studentId, UUID majorId);
}
