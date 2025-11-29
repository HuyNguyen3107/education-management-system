package com.example.server.service;

import com.example.server.dto.ClassesResponseDto;
import com.example.server.dto.CreateClassesDto;
import com.example.server.dto.UpdateClassesDto;
import com.example.server.entity.Classes;
import com.example.server.repository.ClassesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassesService {

    @Autowired
    private ClassesRepository classesRepository;

    /**
     * Lấy tất cả lớp học
     */
    public List<ClassesResponseDto> getAllClasses() {
        return classesRepository.findAll().stream()
                .map(ClassesResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy lớp học theo ID
     */
    public ClassesResponseDto getClassesById(UUID id) {
        Classes classes = classesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với ID: " + id));
        return new ClassesResponseDto(classes);
    }

    /**
     * Lấy lớp học theo mã lớp
     */
    public ClassesResponseDto getClassesByCode(String classCode) {
        Classes classes = classesRepository.findByClassCode(classCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với mã: " + classCode));
        return new ClassesResponseDto(classes);
    }

    /**
     * Tạo lớp học mới
     */
    public ClassesResponseDto createClasses(CreateClassesDto dto) {
        // Kiểm tra mã lớp đã tồn tại chưa
        if (classesRepository.findByClassCode(dto.getClassCode()).isPresent()) {
            throw new RuntimeException("Mã lớp đã tồn tại: " + dto.getClassCode());
        }

        Classes classes = new Classes();
        classes.setClassCode(dto.getClassCode());
        classes.setTeacherId(dto.getTeacherId());
        classes.setMajorId(dto.getMajorId());
        classes.setSpecializationId(dto.getSpecializationId());

        Classes saved = classesRepository.save(classes);
        return new ClassesResponseDto(saved);
    }

    /**
     * Cập nhật lớp học
     */
    public ClassesResponseDto updateClasses(UUID id, UpdateClassesDto dto) {
        Classes classes = classesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với ID: " + id));

        if (dto.getClassCode() != null && !dto.getClassCode().trim().isEmpty()) {
            // Kiểm tra mã lớp mới có trùng với lớp khác không
            classesRepository.findByClassCode(dto.getClassCode()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new RuntimeException("Mã lớp đã tồn tại: " + dto.getClassCode());
                }
            });
            classes.setClassCode(dto.getClassCode());
        }

        if (dto.getTeacherId() != null) {
            classes.setTeacherId(dto.getTeacherId());
        }

        if (dto.getMajorId() != null) {
            classes.setMajorId(dto.getMajorId());
        }

        if (dto.getSpecializationId() != null) {
            classes.setSpecializationId(dto.getSpecializationId());
        }

        Classes updated = classesRepository.save(classes);
        return new ClassesResponseDto(updated);
    }

    /**
     * Xóa lớp học
     */
    public void deleteClasses(UUID id) {
        if (!classesRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy lớp học với ID: " + id);
        }
        classesRepository.deleteById(id);
    }

    /**
     * Lấy lớp học theo teacher_id
     */
    public List<ClassesResponseDto> getClassesByTeacherId(UUID teacherId) {
        return classesRepository.findByTeacherId(teacherId).stream()
                .map(ClassesResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy lớp học theo major_id
     */
    public List<ClassesResponseDto> getClassesByMajorId(UUID majorId) {
        return classesRepository.findByMajorId(majorId).stream()
                .map(ClassesResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy lớp học theo specialization_id
     */
    public List<ClassesResponseDto> getClassesBySpecializationId(UUID specializationId) {
        return classesRepository.findBySpecializationId(specializationId).stream()
                .map(ClassesResponseDto::new)
                .collect(Collectors.toList());
    }
}
