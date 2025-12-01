package com.example.server.service;

import com.example.server.dto.CreateStudentCreditClassDto;
import com.example.server.dto.StudentCreditClassResponseDto;
import com.example.server.dto.UpdateStudentCreditClassDto;
import com.example.server.entity.StudentCreditClass;
import com.example.server.repository.StudentCreditClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentCreditClassService {

    private final StudentCreditClassRepository studentCreditClassRepository;

    public StudentCreditClassService(StudentCreditClassRepository studentCreditClassRepository) {
        this.studentCreditClassRepository = studentCreditClassRepository;
    }

    public List<StudentCreditClassResponseDto> getAllStudentCreditClasses() {
        return studentCreditClassRepository.findAll().stream()
                .map(StudentCreditClassResponseDto::new)
                .collect(Collectors.toList());
    }

    public StudentCreditClassResponseDto getStudentCreditClassById(UUID id) {
        StudentCreditClass studentCreditClass = studentCreditClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentCreditClass not found with id: " + id));
        return new StudentCreditClassResponseDto(studentCreditClass);
    }

    public List<StudentCreditClassResponseDto> getStudentCreditClassesByStudentId(UUID studentId) {
        return studentCreditClassRepository.findByStudentId(studentId).stream()
                .map(StudentCreditClassResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<StudentCreditClassResponseDto> getStudentCreditClassesByCreditClassId(UUID creditClassId) {
        return studentCreditClassRepository.findByCreditClassId(creditClassId).stream()
                .map(StudentCreditClassResponseDto::new)
                .collect(Collectors.toList());
    }

    public StudentCreditClassResponseDto createStudentCreditClass(CreateStudentCreditClassDto createStudentCreditClassDto) {
        // Check if this student-creditClass combination already exists
        if (studentCreditClassRepository.findByStudentIdAndCreditClassId(
                createStudentCreditClassDto.getStudentId(), 
                createStudentCreditClassDto.getCreditClassId()).isPresent()) {
            throw new RuntimeException("This student is already enrolled in this credit class");
        }

        StudentCreditClass studentCreditClass = new StudentCreditClass();
        studentCreditClass.setStudentId(createStudentCreditClassDto.getStudentId());
        studentCreditClass.setCreditClassId(createStudentCreditClassDto.getCreditClassId());
        studentCreditClass.setScores(createStudentCreditClassDto.getScores());
        studentCreditClass.setExamSchedule(createStudentCreditClassDto.getExamSchedule());

        StudentCreditClass savedStudentCreditClass = studentCreditClassRepository.save(studentCreditClass);
        return new StudentCreditClassResponseDto(savedStudentCreditClass);
    }

    public StudentCreditClassResponseDto updateStudentCreditClass(UUID id, UpdateStudentCreditClassDto updateStudentCreditClassDto) {
        StudentCreditClass studentCreditClass = studentCreditClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentCreditClass not found with id: " + id));

        if (updateStudentCreditClassDto.getStudentId() != null) {
            studentCreditClass.setStudentId(updateStudentCreditClassDto.getStudentId());
        }

        if (updateStudentCreditClassDto.getCreditClassId() != null) {
            // Check if the new combination already exists (excluding current record)
            if (updateStudentCreditClassDto.getStudentId() != null || updateStudentCreditClassDto.getCreditClassId() != null) {
                UUID checkStudentId = updateStudentCreditClassDto.getStudentId() != null ? updateStudentCreditClassDto.getStudentId() : studentCreditClass.getStudentId();
                UUID checkCreditClassId = updateStudentCreditClassDto.getCreditClassId() != null ? updateStudentCreditClassDto.getCreditClassId() : studentCreditClass.getCreditClassId();
                
                studentCreditClassRepository.findByStudentIdAndCreditClassId(checkStudentId, checkCreditClassId).ifPresent(existingStudentCreditClass -> {
                    if (!existingStudentCreditClass.getId().equals(id)) {
                        throw new RuntimeException("This student is already enrolled in this credit class");
                    }
                });
            }
            studentCreditClass.setCreditClassId(updateStudentCreditClassDto.getCreditClassId());
        }

        if (updateStudentCreditClassDto.getScores() != null) {
            studentCreditClass.setScores(updateStudentCreditClassDto.getScores());
        }

        if (updateStudentCreditClassDto.getExamSchedule() != null) {
            studentCreditClass.setExamSchedule(updateStudentCreditClassDto.getExamSchedule());
        }

        StudentCreditClass updatedStudentCreditClass = studentCreditClassRepository.save(studentCreditClass);
        return new StudentCreditClassResponseDto(updatedStudentCreditClass);
    }

    public void deleteStudentCreditClass(UUID id) {
        if (!studentCreditClassRepository.existsById(id)) {
            throw new RuntimeException("StudentCreditClass not found with id: " + id);
        }
        studentCreditClassRepository.deleteById(id);
    }
}
