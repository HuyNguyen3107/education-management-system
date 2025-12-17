package com.example.server.service;

import com.example.server.dto.StudentMajorRequestDto;
import com.example.server.dto.StudentMajorResponseDto;
import com.example.server.entity.StudentMajor;
import com.example.server.entity.Student;
import com.example.server.entity.Major;
import com.example.server.entity.Specialization;
import com.example.server.repository.StudentMajorRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.MajorRepository;
import com.example.server.repository.SpecializationRepository;
import com.example.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentMajorService {

    private final StudentMajorRepository studentMajorRepository;
    private final StudentRepository studentRepository;
    private final MajorRepository majorRepository;
    private final SpecializationRepository specializationRepository;
    private final UserRepository userRepository;

    public StudentMajorService(
            StudentMajorRepository studentMajorRepository,
            StudentRepository studentRepository,
            MajorRepository majorRepository,
            SpecializationRepository specializationRepository,
            UserRepository userRepository) {
        this.studentMajorRepository = studentMajorRepository;
        this.studentRepository = studentRepository;
        this.majorRepository = majorRepository;
        this.specializationRepository = specializationRepository;
        this.userRepository = userRepository;
    }

    public List<StudentMajorResponseDto> getAll() {
        return studentMajorRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<StudentMajorResponseDto> getByStudentId(UUID studentId) {
        return studentMajorRepository.findByStudentId(studentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public StudentMajorResponseDto getById(UUID id) {
        StudentMajor studentMajor = studentMajorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy student_major với id: " + id));

        return toResponse(studentMajor);
    }

    public StudentMajorResponseDto create(StudentMajorRequestDto request) {
        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Student_id không tồn tại.");
        }

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Major_id không tồn tại.");
        }

        // Check if specialization is provided and exists
        if (request.getSpecializationId() != null) {
            if (!specializationRepository.existsById(request.getSpecializationId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Specialization_id không tồn tại.");
            }
            // Verify specialization belongs to the selected major
            Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Specialization_id không tồn tại."));
            if (!specialization.getMajorId().equals(request.getMajorId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Chuyên ngành không thuộc ngành đã chọn.");
            }
        }

        // Check if student already has a major assigned
        if (studentMajorRepository.existsByStudentId(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Sinh viên đã được gán ngành. Vui lòng cập nhật thay vì tạo mới.");
        }

        StudentMajor studentMajor = new StudentMajor();
        studentMajor.setStudentId(request.getStudentId());
        studentMajor.setMajorId(request.getMajorId());
        studentMajor.setSpecializationId(request.getSpecializationId());

        return toResponse(studentMajorRepository.save(studentMajor));
    }

    public StudentMajorResponseDto update(UUID id, StudentMajorRequestDto request) {
        StudentMajor studentMajor = studentMajorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy student_major với id: " + id));

        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Student_id không tồn tại.");
        }

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Major_id không tồn tại.");
        }

        // Check if specialization is provided and exists
        if (request.getSpecializationId() != null) {
            if (!specializationRepository.existsById(request.getSpecializationId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Specialization_id không tồn tại.");
            }
            // Verify specialization belongs to the selected major
            Specialization specialization = specializationRepository.findById(request.getSpecializationId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Specialization_id không tồn tại."));
            if (!specialization.getMajorId().equals(request.getMajorId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Chuyên ngành không thuộc ngành đã chọn.");
            }
        }

        studentMajor.setStudentId(request.getStudentId());
        studentMajor.setMajorId(request.getMajorId());
        studentMajor.setSpecializationId(request.getSpecializationId());

        return toResponse(studentMajorRepository.save(studentMajor));
    }

    public void delete(UUID id) {
        if (!studentMajorRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy student_major với id: " + id);
        }

        studentMajorRepository.deleteById(id);
    }

    private StudentMajorResponseDto toResponse(StudentMajor sm) {
        StudentMajorResponseDto res = new StudentMajorResponseDto();
        res.setId(sm.getId());
        res.setStudentId(sm.getStudentId());
        res.setMajorId(sm.getMajorId());
        res.setSpecializationId(sm.getSpecializationId());
        res.setCreatedAt(sm.getCreatedAt());
        res.setUpdatedAt(sm.getUpdatedAt());

        // Fetch student info
        studentRepository.findById(sm.getStudentId()).ifPresent(student -> {
            res.setStudentCode(student.getStudentCode());
            // Fetch user name
            userRepository.findById(student.getUserId()).ifPresent(user -> {
                res.setStudentName(user.getName());
            });
        });

        // Fetch major info
        majorRepository.findById(sm.getMajorId()).ifPresent(major -> {
            res.setMajorName(major.getName());
        });

        // Fetch specialization info if exists
        if (sm.getSpecializationId() != null) {
            specializationRepository.findById(sm.getSpecializationId()).ifPresent(specialization -> {
                res.setSpecializationName(specialization.getName());
            });
        }

        return res;
    }
}
