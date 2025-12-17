package com.example.server.repository;

import com.example.server.entity.CreditClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CreditClassRepository extends JpaRepository<CreditClass, UUID> {
    List<CreditClass> findBySubjectCodeInAndSemester(List<String> subjectCodes, String semester);

    List<CreditClass> findByTeacherId(UUID teacherId);
}
