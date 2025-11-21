package com.example.server.service;

import com.example.server.dto.CreateStudentDto;
import com.example.server.dto.StudentResponseDto;
import com.example.server.dto.UpdateStudentDto;
import com.example.server.entity.Student;
import com.example.server.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    
     // Lấy tất cả sinh viên
     
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentResponseDto::new)
                .collect(Collectors.toList());
    }

    // Lấy sinh viên theo ID
    
    public StudentResponseDto getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));
        return new StudentResponseDto(student);
    }

    // Lấy sinh viên theo mã sinh viên
    public StudentResponseDto getStudentByCode(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với mã: " + studentCode));
        return new StudentResponseDto(student);
    }

    // Lấy sinh viên theo user_id
    public StudentResponseDto getStudentByUserId(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với user ID: " + userId));
        return new StudentResponseDto(student);
    }

    // Tạo sinh viên mới
    public StudentResponseDto createStudent(CreateStudentDto dto) {
        // Kiểm tra mã sinh viên đã tồn tại chưa
        if (studentRepository.findByStudentCode(dto.getStudentCode()).isPresent()) {
            throw new RuntimeException("Mã sinh viên đã tồn tại: " + dto.getStudentCode());
        }

        // Kiểm tra user_id đã được gán cho sinh viên khác chưa
        if (studentRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new RuntimeException("User ID đã được gán cho sinh viên khác: " + dto.getUserId());
        }

        Student student = new Student();
        student.setStudentCode(dto.getStudentCode());
        student.setUserId(dto.getUserId());

        Student saved = studentRepository.save(student);
        return new StudentResponseDto(saved);
    }

    // Cập nhật sinh viên
     
    public StudentResponseDto updateStudent(UUID id, UpdateStudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));

        if (dto.getStudentCode() != null && !dto.getStudentCode().trim().isEmpty()) {
            // Kiểm tra mã sinh viên mới có trùng với sinh viên khác không
            studentRepository.findByStudentCode(dto.getStudentCode()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new RuntimeException("Mã sinh viên đã tồn tại: " + dto.getStudentCode());
                }
            });
            student.setStudentCode(dto.getStudentCode());
        }

        if (dto.getUserId() != null) {
            // Kiểm tra user_id mới có được gán cho sinh viên khác không
            studentRepository.findByUserId(dto.getUserId()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new RuntimeException("User ID đã được gán cho sinh viên khác: " + dto.getUserId());
                }
            });
            student.setUserId(dto.getUserId());
        }

        Student updated = studentRepository.save(student);
        return new StudentResponseDto(updated);
    }

    // Xóa sinh viên
    public void deleteStudent(UUID id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sinh viên với ID: " + id);
        }
        studentRepository.deleteById(id);
    }
}
