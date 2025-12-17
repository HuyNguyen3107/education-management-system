package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.entity.*;
import com.example.server.repository.*;
import com.example.server.exception.NotFoundException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LecturerService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final CreditClassRepository creditClassRepository;
    private final StudentCreditClassRepository studentCreditClassRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    public LecturerService(UserRepository userRepository,
            TeacherRepository teacherRepository,
            CreditClassRepository creditClassRepository,
            StudentCreditClassRepository studentCreditClassRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository) {
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.creditClassRepository = creditClassRepository;
        this.studentCreditClassRepository = studentCreditClassRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
    }

    public List<CreditClassResponseDto> getAssignedClasses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Teacher profile not found for user"));

        List<CreditClass> classes = creditClassRepository.findByTeacherId(teacher.getId());

        return classes.stream().map(cc -> {
            CreditClassResponseDto dto = new CreditClassResponseDto();
            dto.setId(cc.getId());
            dto.setSubjectCode(cc.getSubjectCode());
            dto.setTeacherId(cc.getTeacherId());
            dto.setGroup(cc.getGroup());
            dto.setQuantity(cc.getQuantity());
            dto.setRoom(cc.getRoom());
            dto.setSemester(cc.getSemester());
            dto.setCreatedAt(cc.getCreatedAt());
            dto.setUpdatedAt(cc.getUpdatedAt());

            ObjectMapper mapper = new ObjectMapper();
            try {
                if (cc.getSchedule() != null) {
                    dto.setSchedule(mapper.convertValue(cc.getSchedule(), new TypeReference<List<ScheduleItemDto>>() {
                    }));
                }
            } catch (Exception e) {
                // ignore
            }

            subjectRepository.findBySubjectCode(cc.getSubjectCode())
                    .ifPresent(subject -> dto.setName(subject.getName()));

            int enrolledCount = studentCreditClassRepository.findByCreditClassId(cc.getId()).size();
            dto.setEnrolledCount(enrolledCount);

            return dto;
        }).collect(Collectors.toList());
    }

    public List<LecturerStudentResponseDto> getStudentsInClass(UUID classId) {
        // Verify class exists
        if (!creditClassRepository.existsById(classId)) {
            throw new NotFoundException("Class not found");
        }

        List<StudentCreditClass> enrollments = studentCreditClassRepository.findByCreditClassId(classId);

        return enrollments.stream().map(scc -> {
            Student student = studentRepository.findById(scc.getStudentId())
                    .orElse(null);

            if (student == null)
                return null;

            LecturerStudentResponseDto dto = new LecturerStudentResponseDto();
            dto.setStudentId(student.getId());
            dto.setStudentCode(student.getStudentCode());
            dto.setScores(scc.getScores());

            // Fetch name from User entity via Student.userId
            userRepository.findById(student.getUserId()).ifPresent(u -> dto.setStudentName(u.getName()));

            return dto;
        }).filter(java.util.Objects::nonNull).collect(Collectors.toList());
    }

    public void updateGrade(UUID classId, UUID studentId, JsonNode scores) {
        StudentCreditClass enrollment = studentCreditClassRepository.findByStudentIdAndCreditClassId(studentId, classId)
                .orElseThrow(() -> new NotFoundException("Student not enrolled in this class"));

        enrollment.setScores(scores);
        studentCreditClassRepository.save(enrollment);
    }

    public LecturerProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Teacher profile not found for user"));

        LecturerProfileDto dto = new LecturerProfileDto();
        dto.setId(teacher.getId());
        dto.setTeacherCode(teacher.getTeacherCode());
        dto.setUserId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setGender(user.getGender());
        dto.setDateOfBirth(user.getDateOfBirth());

        return dto;
    }
}
