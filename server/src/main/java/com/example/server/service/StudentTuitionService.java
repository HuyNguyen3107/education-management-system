package com.example.server.service;

import com.example.server.dto.StudentTuitionRequestDto;
import com.example.server.dto.StudentTuitionResponseDto;
import com.example.server.entity.StudentTuition;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.StudentTuitionRepository;
import com.example.server.repository.TuitionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class StudentTuitionService {

    private final StudentTuitionRepository studentTuitionRepository;
    private final StudentRepository studentRepository;
    private final TuitionRepository tuitionRepository;

    public StudentTuitionService(
            StudentTuitionRepository studentTuitionRepository,
            StudentRepository studentRepository,
            TuitionRepository tuitionRepository) {
        this.studentTuitionRepository = studentTuitionRepository;
        this.studentRepository = studentRepository;
        this.tuitionRepository = tuitionRepository;
    }

    public List<StudentTuitionResponseDto> getAll() {
        return studentTuitionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StudentTuitionResponseDto getById(UUID id) {
        StudentTuition studentTuition = studentTuitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy student_tuition với id: " + id));

        return toResponse(studentTuition);
    }

    public StudentTuitionResponseDto create(StudentTuitionRequestDto request) {

        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Student_id không tồn tại.");
        }

        if (!tuitionRepository.existsById(request.getTuitionId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tuition_id không tồn tại.");
        }

        if (studentTuitionRepository.existsByStudentIdAndTuitionId(
                request.getStudentId(), request.getTuitionId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Sinh viên đã được gán học phí này.");
        }

        StudentTuition st = new StudentTuition();
        st.setStudentId(request.getStudentId());
        st.setTuitionId(request.getTuitionId());
        st.setEndow(request.getEndow());

        return toResponse(studentTuitionRepository.save(st));
    }

    public StudentTuitionResponseDto update(UUID id, StudentTuitionRequestDto request) {

        StudentTuition st = studentTuitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy student_tuition với id: " + id));

        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Student_id không tồn tại.");
        }

        if (!tuitionRepository.existsById(request.getTuitionId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Tuition_id không tồn tại.");
        }

        if (studentTuitionRepository.existsByStudentIdAndTuitionIdAndIdNot(
                request.getStudentId(), request.getTuitionId(), id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Sinh viên đã được gán học phí này.");
        }

        st.setStudentId(request.getStudentId());
        st.setTuitionId(request.getTuitionId());
        st.setEndow(request.getEndow());

        return toResponse(studentTuitionRepository.save(st));
    }

    public void delete(UUID id) {
        if (!studentTuitionRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy student_tuition với id: " + id);
        }

        studentTuitionRepository.deleteById(id);
    }

    private StudentTuitionResponseDto toResponse(StudentTuition st) {
        StudentTuitionResponseDto res = new StudentTuitionResponseDto();
        res.setId(st.getId());
        res.setStudentId(st.getStudentId());
        res.setTuitionId(st.getTuitionId());
        res.setEndow(st.getEndow());
        res.setCreatedAt(st.getCreatedAt());
        res.setUpdatedAt(st.getUpdatedAt());
        return res;
    }
}
