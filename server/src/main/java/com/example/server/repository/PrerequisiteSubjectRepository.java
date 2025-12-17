package com.example.server.repository;

import com.example.server.dto.PrerequisiteSubjectPublicDto;
import com.example.server.entity.PrerequisiteSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PrerequisiteSubjectRepository extends JpaRepository<PrerequisiteSubject, UUID> {

    // Tìm tất cả môn tiên quyết của một môn học (theo register_code)
    List<PrerequisiteSubject> findByRegisterCode(String registerCode);

    // Tìm tất cả môn học yêu cầu một môn nào đó làm tiên quyết
    List<PrerequisiteSubject> findByPrerequisiteCode(String prerequisiteCode);

    // Tìm theo cả 2 mã
    List<PrerequisiteSubject> findByRegisterCodeAndPrerequisiteCode(String registerCode, String prerequisiteCode);

    @Query("SELECT new com.example.server.dto.PrerequisiteSubjectPublicDto(ps.id, ps.registerCode, s1.name, ps.prerequisiteCode, s2.name, m.name) "
            +
            "FROM PrerequisiteSubject ps " +
            "LEFT JOIN Subject s1 ON ps.registerCode = s1.subjectCode " +
            "LEFT JOIN Subject s2 ON ps.prerequisiteCode = s2.subjectCode " +
            "LEFT JOIN Major m ON s1.majorId = m.id")
    List<PrerequisiteSubjectPublicDto> findAllWithNames();

    @Query("SELECT new com.example.server.dto.PrerequisiteSubjectPublicDto(ps.id, ps.registerCode, s1.name, ps.prerequisiteCode, s2.name, m.name) "
            +
            "FROM PrerequisiteSubject ps " +
            "LEFT JOIN Subject s1 ON ps.registerCode = s1.subjectCode " +
            "LEFT JOIN Subject s2 ON ps.prerequisiteCode = s2.subjectCode " +
            "LEFT JOIN Major m ON s1.majorId = m.id " +
            "WHERE s1.majorId = :majorId AND (s1.specializationId = :specializationId OR s1.specializationId IS NULL)")
    List<PrerequisiteSubjectPublicDto> findByMajorAndSpecialization(UUID majorId, UUID specializationId);
}
