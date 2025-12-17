package com.example.server.repository;

import com.example.server.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

  // Tìm môn học theo mã môn học
  Optional<Subject> findBySubjectCode(String subjectCode);

  // Tìm môn học theo major_id
  List<Subject> findByMajorId(UUID majorId);

  // Tìm môn học theo specialization_id
  List<Subject> findBySpecializationId(UUID specializationId);

  // Tìm môn học theo học kỳ
  List<Subject> findBySemester(String semester);

  // Tìm môn học theo major_id và semester
  List<Subject> findByMajorIdAndSemester(UUID majorId, String semester);

  // Tìm môn học theo major_id hoặc specialization_id
  List<Subject> findByMajorIdOrSpecializationId(UUID majorId, UUID specializationId);
}
