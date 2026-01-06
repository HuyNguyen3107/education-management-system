package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.entity.*;
import com.example.server.repository.*;
import com.example.server.exception.NotFoundException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private final ClassesRepository classesRepository;

    public LecturerService(UserRepository userRepository,
            TeacherRepository teacherRepository,
            CreditClassRepository creditClassRepository,
            StudentCreditClassRepository studentCreditClassRepository,
            StudentRepository studentRepository,
            SubjectRepository subjectRepository,
            ClassesRepository classesRepository) {
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.creditClassRepository = creditClassRepository;
        this.studentCreditClassRepository = studentCreditClassRepository;
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.classesRepository = classesRepository;
    }

    public List<CreditClassResponseDto> getAssignedClasses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ giảng viên cho người dùng"));

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

    /**
     * Get assigned classes for the current semester only
     * @param email Lecturer's email
     * @return List of credit classes for current semester
     */
    public List<CreditClassResponseDto> getAssignedClassesForCurrentSemester(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ giảng viên cho người dùng"));

        List<CreditClass> allClasses = creditClassRepository.findByTeacherId(teacher.getId());
        String currentSemester = determineCurrentSemester();

        // Filter by current semester
        List<CreditClass> currentSemesterClasses = allClasses.stream()
                .filter(cc -> cc.getSemester().equals(currentSemester))
                .collect(Collectors.toList());

        return currentSemesterClasses.stream().map(cc -> {
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

    /**
     * Determine the current semester based on the current date
     * Semester 1: September to January (9-1)
     * Semester 2: February to June (2-6)
     * @return Semester number as string ("1" or "2")
     */
    private String determineCurrentSemester() {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        
        // Semester 1: September (9) to January (1)
        if (month >= 9 || month <= 1) {
            return "1";
        }
        // Semester 2: February (2) to June (6)
        else if (month >= 2 && month <= 6) {
            return "2";
        }
        // Summer: July (7) to August (8) - consider as semester 2 for simplicity
        else {
            return "2";
        }
    }

    public List<LecturerStudentResponseDto> getStudentsInClass(UUID classId) {
        // Verify class exists
        if (!creditClassRepository.existsById(classId)) {
            throw new NotFoundException("Không tìm thấy lớp học phần");
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
                .orElseThrow(() -> new NotFoundException("Sinh viên chưa đăng ký lớp học phần này"));

        enrollment.setScores(scores);
        studentCreditClassRepository.save(enrollment);
    }

    public LecturerProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ giảng viên cho người dùng"));

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

    public List<ClassesResponseDto> getAdministrativeClasses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        Teacher teacher = teacherRepository.findByUserId(user.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy hồ sơ giảng viên cho người dùng"));

        List<Classes> classes = classesRepository.findByTeacherId(teacher.getId());

        return classes.stream().map(ClassesResponseDto::new).collect(Collectors.toList());
    }

    public List<LecturerStudentResponseDto> getAdministrativeClassStudents(UUID classId) {
        if (!classesRepository.existsById(classId)) {
            throw new NotFoundException("Không tìm thấy lớp chủ nhiệm");
        }

        List<Student> students = studentRepository.findByClassId(classId);

        return students.stream().map(student -> {
            LecturerStudentResponseDto dto = new LecturerStudentResponseDto();
            dto.setStudentId(student.getId());
            dto.setStudentCode(student.getStudentCode());
            dto.setScores(null); // No scores for admin class listing

            // Fetch name from User entity via Student.userId
            userRepository.findById(student.getUserId()).ifPresent(u -> dto.setStudentName(u.getName()));

            return dto;
        }).collect(Collectors.toList());
    }
}
