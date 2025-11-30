package com.example.server.repository;

import com.example.server.entity.PrerequisiteSubject;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
