package com.example.server.service;

import com.example.server.dto.CreateSubjectDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.dto.UpdateSubjectDto;
import com.example.server.entity.Subject;
import com.example.server.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    /**
     * Lấy tất cả môn học
     */
    public List<SubjectResponseDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy môn học theo ID
     */
    public SubjectResponseDto getSubjectById(UUID id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy môn học với ID: " + id));
        return new SubjectResponseDto(subject);
    }

    /**
     * Lấy môn học theo mã môn học
     */
    public SubjectResponseDto getSubjectByCode(String subjectCode) {
        Subject subject = subjectRepository.findBySubjectCode(subjectCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy môn học với mã: " + subjectCode));
        return new SubjectResponseDto(subject);
    }

    /**
     * Tạo môn học mới
     */
    public SubjectResponseDto createSubject(CreateSubjectDto dto) {
        // Kiểm tra mã môn học đã tồn tại chưa
        if (subjectRepository.findBySubjectCode(dto.getSubjectCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã môn học đã tồn tại: " + dto.getSubjectCode());
        }

        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setSubjectCode(dto.getSubjectCode());
        subject.setMajorId(dto.getMajorId());
        subject.setSpecializationId(dto.getSpecializationId());
        subject.setNumberOfCredit(dto.getNumberOfCredit());
        subject.setIngredientSecretion(dto.getIngredientSecretion());
        subject.setSemester(dto.getSemester());

        Subject saved = subjectRepository.save(subject);
        return new SubjectResponseDto(saved);
    }

    /**
     * Cập nhật môn học
     */
    public SubjectResponseDto updateSubject(UUID id, UpdateSubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy môn học với ID: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            subject.setName(dto.getName());
        }
        if (dto.getSubjectCode() != null) {
            if (dto.getSubjectCode().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã môn học không được để trống.");
            }
            // Kiểm tra mã môn học mới có trùng với môn học khác không
            subjectRepository.findBySubjectCode(dto.getSubjectCode()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã môn học đã tồn tại: " + dto.getSubjectCode());
                }
            });
            subject.setSubjectCode(dto.getSubjectCode());
        }
        if (dto.getMajorId() != null) {
            subject.setMajorId(dto.getMajorId());
        }
        if (dto.getSpecializationId() != null) {
            subject.setSpecializationId(dto.getSpecializationId());
        }
        if (dto.getNumberOfCredit() != null) {
            subject.setNumberOfCredit(dto.getNumberOfCredit());
        }
        if (dto.getIngredientSecretion() != null) {
            subject.setIngredientSecretion(dto.getIngredientSecretion());
        }
        if (dto.getSemester() != null && !dto.getSemester().trim().isEmpty()) {
            subject.setSemester(dto.getSemester());
        }

        Subject updated = subjectRepository.save(subject);
        return new SubjectResponseDto(updated);
    }

    /**
     * Xóa môn học
     */
    public void deleteSubject(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy môn học với ID: " + id);
        }
        subjectRepository.deleteById(id);
    }

    /**
     * Lấy môn học theo major_id
     */
    public List<SubjectResponseDto> getSubjectsByMajorId(UUID majorId) {
        return subjectRepository.findByMajorId(majorId).stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy môn học theo specialization_id
     */
    public List<SubjectResponseDto> getSubjectsBySpecializationId(UUID specializationId) {
        return subjectRepository.findBySpecializationId(specializationId).stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy môn học theo học kỳ
     */
    public List<SubjectResponseDto> getSubjectsBySemester(String semester) {
        return subjectRepository.findBySemester(semester).stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy môn học theo major_id và semester
     */
    public List<SubjectResponseDto> getSubjectsByMajorIdAndSemester(UUID majorId, String semester) {
        return subjectRepository.findByMajorIdAndSemester(majorId, semester).stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }
}
