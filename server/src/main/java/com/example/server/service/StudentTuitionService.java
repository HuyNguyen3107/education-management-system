package com.example.server.service;

import com.example.server.dto.StudentTuitionRequestDto;
import com.example.server.dto.StudentTuitionResponseDto;
import com.example.server.entity.StudentTuition;
import com.example.server.entity.Tuition;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.StudentTuitionRepository;
import com.example.server.repository.TuitionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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

    public List<Map<String, Object>> getStudentTuitionDetails(UUID studentId) {
        // 1. Get all tuition records assigned to student
        List<StudentTuition> studentTuitions = studentTuitionRepository.findByStudentId(studentId);

        // 2. Fetch Tuition details and map
        List<Map<String, Object>> result = new ArrayList<>();

        for (StudentTuition st : studentTuitions) {
            Tuition tuition = tuitionRepository.findById(st.getTuitionId()).orElse(null);
            if (tuition == null)
                continue;

            Map<String, Object> map = new HashMap<>();
            map.put("id", st.getId());
            map.put("semester", tuition.getSemester());
            map.put("year", tuition.getYear());
            map.put("academicYear", tuition.getAcademicYear());

            // Format: "Học kỳ X - Năm học YYYY - ZZZZ"
            String termName = "Học kỳ " + tuition.getSemester() + " - Năm học " + tuition.getYear();
            map.put("termName", termName);

            double price = tuition.getPrice();
            double endow = st.getEndow() != null ? st.getEndow() : 0.0;
            double paid = st.getPaid() != null ? st.getPaid() : 0.0;
            double required = price - endow;
            double debt = required - paid;

            map.put("price", price); // HP chưa giảm
            map.put("endow", endow); // Miễn giảm
            map.put("required", required); // Phải thu
            map.put("paid", paid); // Đã thu
            map.put("debt", debt); // Còn nợ

            // Logic to determine "Type" (Regular vs Retake)
            // Currently we don't have a clear flag for "Retake".
            // Assuming all in 'tuitions' table are regular semester fees unless specified
            // otherwise.
            // For now, let's categorize everything as "Thu Học Phí" (Regular)
            // or maybe based on some convention.
            // Let's assume a default type for now.
            map.put("type", "Thu Học Phí");

            result.add(map);
        }

        // Sort by year and semester
        result.sort((a, b) -> {
            String y1 = (String) a.get("year");
            String y2 = (String) b.get("year");
            int yearComp = y1.compareTo(y2);
            if (yearComp != 0)
                return yearComp;

            String s1 = (String) a.get("semester");
            String s2 = (String) b.get("semester");
            return s1.compareTo(s2);
        });

        return result;
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
