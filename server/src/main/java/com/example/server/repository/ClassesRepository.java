package com.example.server.repository;

import com.example.server.entity.Classes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassesRepository extends JpaRepository<Classes, UUID> {
    
    /**
     * Tìm lớp học theo mã lớp
     */
    Optional<Classes> findByClassCode(String classCode);
    
    /**
     * Tìm lớp học theo teacher_id
     */
    List<Classes> findByTeacherId(UUID teacherId);
    
    /**
     * Tìm lớp học theo major_id
     */
    List<Classes> findByMajorId(UUID majorId);
    
    /**
     * Tìm lớp học theo specialization_id
     */
    List<Classes> findBySpecializationId(UUID specializationId);
}
