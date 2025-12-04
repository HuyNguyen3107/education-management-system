package com.example.server.repository;

import com.example.server.entity.StudentTuition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudentTuitionRepository extends JpaRepository<StudentTuition, UUID> {

    boolean existsByStudentIdAndTuitionId(UUID studentId, UUID tuitionId);

    boolean existsByStudentIdAndTuitionIdAndIdNot(UUID studentId, UUID tuitionId, UUID id);
}
