package com.example.server.repository;

import com.example.server.entity.StudentCreditClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentCreditClassRepository extends JpaRepository<StudentCreditClass, UUID> {
    List<StudentCreditClass> findByStudentId(UUID studentId);
    List<StudentCreditClass> findByCreditClassId(UUID creditClassId);
    Optional<StudentCreditClass> findByStudentIdAndCreditClassId(UUID studentId, UUID creditClassId);
}
