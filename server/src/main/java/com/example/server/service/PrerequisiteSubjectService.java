package com.example.server.service;

import com.example.server.dto.CreatePrerequisiteSubjectDto;
import com.example.server.dto.PrerequisiteSubjectPublicDto;
import com.example.server.dto.PrerequisiteSubjectResponseDto;
import com.example.server.dto.UpdatePrerequisiteSubjectDto;
import com.example.server.entity.PrerequisiteSubject;
import com.example.server.repository.PrerequisiteSubjectRepository;
import com.example.server.repository.StudentMajorRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.entity.Student;
import com.example.server.entity.StudentMajor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PrerequisiteSubjectService {

    @Autowired
    private PrerequisiteSubjectRepository prerequisiteSubjectRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentMajorRepository studentMajorRepository;

    /**
     * Lấy tất cả môn tiên quyết
     */
    public List<PrerequisiteSubjectResponseDto> getAllPrerequisiteSubjects() {
        return prerequisiteSubjectRepository.findAll().stream()
                .map(PrerequisiteSubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy môn tiên quyết theo ID
     */
    public PrerequisiteSubjectResponseDto getPrerequisiteSubjectById(UUID id) {
        PrerequisiteSubject prerequisiteSubject = prerequisiteSubjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn tiên quyết với ID: " + id));
        return new PrerequisiteSubjectResponseDto(prerequisiteSubject);
    }

    /**
     * Tạo môn tiên quyết mới
     */
    public PrerequisiteSubjectResponseDto createPrerequisiteSubject(CreatePrerequisiteSubjectDto dto) {
        PrerequisiteSubject prerequisiteSubject = new PrerequisiteSubject();
        prerequisiteSubject.setRegisterCode(dto.getRegisterCode());
        prerequisiteSubject.setPrerequisiteCode(dto.getPrerequisiteCode());

        PrerequisiteSubject saved = prerequisiteSubjectRepository.save(prerequisiteSubject);
        return new PrerequisiteSubjectResponseDto(saved);
    }

    /**
     * Cập nhật môn tiên quyết
     */
    public PrerequisiteSubjectResponseDto updatePrerequisiteSubject(UUID id, UpdatePrerequisiteSubjectDto dto) {
        PrerequisiteSubject prerequisiteSubject = prerequisiteSubjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy môn tiên quyết với ID: " + id));

        if (dto.getRegisterCode() != null && !dto.getRegisterCode().trim().isEmpty()) {
            prerequisiteSubject.setRegisterCode(dto.getRegisterCode());
        }
        if (dto.getPrerequisiteCode() != null && !dto.getPrerequisiteCode().trim().isEmpty()) {
            prerequisiteSubject.setPrerequisiteCode(dto.getPrerequisiteCode());
        }

        PrerequisiteSubject updated = prerequisiteSubjectRepository.save(prerequisiteSubject);
        return new PrerequisiteSubjectResponseDto(updated);
    }

    /**
     * Xóa môn tiên quyết
     */
    public void deletePrerequisiteSubject(UUID id) {
        if (!prerequisiteSubjectRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy môn tiên quyết với ID: " + id);
        }
        prerequisiteSubjectRepository.deleteById(id);
    }

    /**
     * Lấy tất cả môn tiên quyết của một môn học
     */
    public List<PrerequisiteSubjectResponseDto> getPrerequisitesByRegisterCode(String registerCode) {
        return prerequisiteSubjectRepository.findByRegisterCode(registerCode).stream()
                .map(PrerequisiteSubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả môn học yêu cầu một môn làm tiên quyết
     */
    public List<PrerequisiteSubjectResponseDto> getByPrerequisiteCode(String prerequisiteCode) {
        return prerequisiteSubjectRepository.findByPrerequisiteCode(prerequisiteCode).stream()
                .map(PrerequisiteSubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm theo cả 2 mã
     */
    public List<PrerequisiteSubjectResponseDto> searchByBothCodes(String registerCode, String prerequisiteCode) {
        return prerequisiteSubjectRepository.findByRegisterCodeAndPrerequisiteCode(registerCode, prerequisiteCode)
                .stream()
                .map(PrerequisiteSubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách môn tiên quyết public (kèm tên môn học), lọc theo userId nếu có
     */
    public List<PrerequisiteSubjectPublicDto> getPublicPrerequisiteSubjects(UUID userId) {
        if (userId != null) {
            // Tìm sinh viên theo userId
            Student student = studentRepository.findByUserId(userId).orElse(null);
            if (student != null) {
                // Lấy thông tin ngành/chuyên ngành của sinh viên
                // Giả sử sinh viên chỉ có 1 ngành chính (lấy cái đầu tiên tìm thấy)
                List<StudentMajor> studentMajors = studentMajorRepository.findByStudentId(student.getId());
                if (!studentMajors.isEmpty()) {
                    StudentMajor sm = studentMajors.get(0);
                    // Lọc môn tiên quyết theo ngành/chuyên ngành
                    return prerequisiteSubjectRepository.findByMajorAndSpecialization(sm.getMajorId(),
                            sm.getSpecializationId());
                }
            }
        }
        // Nếu không có userId hoặc không tìm thấy sinh viên/ngành, trả về list rỗng
        // Chỉ hiển thị môn học tiên quyết của ngành/chuyên ngành của user đó
        return Collections.emptyList();
    }
}
