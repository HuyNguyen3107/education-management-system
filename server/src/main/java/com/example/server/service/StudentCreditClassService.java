package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.entity.*;
import com.example.server.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;

@Service
public class StudentCreditClassService {

    private final StudentCreditClassRepository studentCreditClassRepository;
    private final TimeRegisterRepository timeRegisterRepository;
    private final AspirationRegisterRepository aspirationRegisterRepository;
    private final CreditClassRepository creditClassRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;

    public StudentCreditClassService(StudentCreditClassRepository studentCreditClassRepository,
            TimeRegisterRepository timeRegisterRepository,
            AspirationRegisterRepository aspirationRegisterRepository,
            CreditClassRepository creditClassRepository,
            SubjectRepository subjectRepository,
            TeacherRepository teacherRepository) {
        this.studentCreditClassRepository = studentCreditClassRepository;
        this.timeRegisterRepository = timeRegisterRepository;
        this.aspirationRegisterRepository = aspirationRegisterRepository;
        this.creditClassRepository = creditClassRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
    }

    public List<CreditClassResponseDto> getAvailableClassesForRegistration(UUID studentId) {
        // 1. Check valid TimeRegister (type_register = "subject_registration")
        TimeRegister activePeriod = findActiveRegistrationPeriod();
        if (activePeriod == null) {
            throw new RuntimeException("Hiện không trong thời gian đăng ký môn học.");
        }

        // 2. Get Student's Wishlist for the current semester
        // Note: activePeriod.getTypeSemester() should match the semester in
        // AspirationRegister
        // Ideally we filter by semester too, but assuming
        // aspirationRegisterRepository.findByStudentId returns all.
        // We will filter by subject codes.
        List<AspirationRegister> wishlist = aspirationRegisterRepository.findByStudentId(studentId);
        if (wishlist.isEmpty()) {
            return new ArrayList<>();
        }

        // Filter wishlist items that match the active semester
        String currentSemester = activePeriod.getTypeSemester();
        List<String> subjectCodes = wishlist.stream()
                .filter(ar -> ar.getSemester().equals(currentSemester))
                .map(AspirationRegister::getSubjectCode)
                .collect(Collectors.toList());

        if (subjectCodes.isEmpty()) {
            return new ArrayList<>();
        }

        // 3. Find CreditClasses matching subject codes and semester
        List<CreditClass> creditClasses = creditClassRepository.findBySubjectCodeInAndSemester(subjectCodes,
                currentSemester);

        // 4. Map to DTO and enrich with Subject Name, Teacher Name, and Enrolled Count
        return creditClasses.stream().map(cc -> {
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

            // Convert Schedule JSON
            ObjectMapper mapper = new ObjectMapper();
            try {
                if (cc.getSchedule() != null) {
                    dto.setSchedule(mapper.convertValue(cc.getSchedule(), new TypeReference<List<ScheduleItemDto>>() {
                    }));
                }
            } catch (Exception e) {
                // ignore
            }

            // Get Subject Name
            subjectRepository.findBySubjectCode(cc.getSubjectCode())
                    .ifPresent(subject -> dto.setName(subject.getName()));

            // Get Enrolled Count
            int enrolledCount = studentCreditClassRepository.findByCreditClassId(cc.getId()).size();
            dto.setEnrolledCount(enrolledCount);

            return dto;
        }).collect(Collectors.toList());
    }

    private TimeRegister findActiveRegistrationPeriod() {
        List<TimeRegister> periods = timeRegisterRepository.findByTypeRegister("subject_registration");
        LocalDate now = LocalDate.now();

        for (TimeRegister p : periods) {
            LocalDate start = parseDate(p.getOpenTime());
            LocalDate end = parseDate(p.getEndTime());

            if (start != null && end != null) {
                if (!now.isBefore(start) && !now.isAfter(end)) {
                    return p;
                }
            }
        }
        return null;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        } catch (Exception e) {
            try {
                return LocalDate.parse(dateStr);
            } catch (Exception ex) {
                return null;
            }
        }
    }

    public List<Map<String, Object>> getStudentExamSchedule(UUID studentId) {
        List<StudentCreditClass> enrolled = studentCreditClassRepository.findByStudentId(studentId);
        List<Map<String, Object>> result = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();

        for (StudentCreditClass scc : enrolled) {
            JsonNode examNode = scc.getExamSchedule();
            if (examNode == null || examNode.isNull() || examNode.isEmpty())
                continue;

            // Assuming examSchedule is an object or array.
            // Based on requirement, it seems to be one exam per class usually, or list.
            // Let's assume it can be a list of exams.
            // If it's a single object, we wrap it.
            List<JsonNode> exams = new ArrayList<>();
            if (examNode.isArray()) {
                examNode.forEach(exams::add);
            } else {
                exams.add(examNode);
            }

            CreditClass cc = creditClassRepository.findById(scc.getCreditClassId()).orElse(null);
            if (cc == null)
                continue;

            String subjectName = subjectRepository.findBySubjectCode(cc.getSubjectCode())
                    .map(Subject::getName).orElse("Không xác định");

            for (JsonNode exam : exams) {
                Map<String, Object> map = new HashMap<>();
                map.put("subjectCode", cc.getSubjectCode());
                map.put("subjectName", subjectName);
                map.put("group", cc.getGroup());
                map.put("quantity", cc.getQuantity()); // Sĩ số

                // Exam details from JSON
                map.put("examDate", exam.has("date") ? exam.get("date").asText() : "");
                map.put("startTime", exam.has("startTime") ? exam.get("startTime").asText() : "");
                map.put("duration", exam.has("duration") ? exam.get("duration").asInt() : 0); // Phút
                map.put("room", exam.has("room") ? exam.get("room").asText() : "");
                map.put("form", exam.has("form") ? exam.get("form").asText() : "Tự luận"); // Hình thức thi

                // Type of exam (e.g. "Thi kết thúc môn")
                map.put("type", exam.has("type") ? exam.get("type").asText() : "Thi kết thúc môn");

                result.add(map);
            }
        }
        return result;
    }

    public List<Map<String, Object>> getStudentGrades(UUID studentId) {
        List<StudentCreditClass> enrolled = studentCreditClassRepository.findByStudentId(studentId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (StudentCreditClass scc : enrolled) {
            CreditClass cc = creditClassRepository.findById(scc.getCreditClassId()).orElse(null);
            if (cc == null)
                continue;

            Subject subject = subjectRepository.findBySubjectCode(cc.getSubjectCode()).orElse(null);
            if (subject == null)
                continue;

            Map<String, Object> map = new HashMap<>();
            map.put("id", scc.getId());
            map.put("subjectCode", cc.getSubjectCode());
            map.put("subjectName", subject.getName());
            map.put("numberOfCredit", subject.getNumberOfCredit());
            map.put("semester", cc.getSemester()); // For grouping
            map.put("group", cc.getGroup()); // Nhom mon hoc

            // Assuming we can derive academic year from cc.getSemester() or need another
            // lookup
            // For now, let's group by Semester only or assume frontend handles grouping
            // display.

            // Scores
            JsonNode scores = scc.getScores();
            if (scores != null) {
                // Map common fields if they exist in JSON
                // Example structure: { "attendance": 10, "midterm": 8, "final": 7, "total_10":
                // 8.0, "total_4": 3.5, "letter": "B" }
                // We need to be flexible or strictly follow a convention.

                // Detailed components for modal
                List<Map<String, Object>> components = new ArrayList<>();
                if (scores.has("components")) {
                    scores.get("components").forEach(c -> {
                        Map<String, Object> comp = new HashMap<>();
                        comp.put("name", c.has("name") ? c.get("name").asText() : "");
                        comp.put("weight", c.has("weight") ? c.get("weight").asInt() : 0);
                        comp.put("score", c.has("score") ? c.get("score").asDouble() : 0.0);
                        components.add(comp);
                    });
                } else {
                    // Fallback: try to read standard keys or from Subject ingredient_secretion
                    // For now, just send raw scores if components missing
                }
                map.put("scoreComponents", components);

                // Main columns
                map.put("examScore", scores.has("final") ? scores.get("final").asDouble() : null);
                map.put("totalScore10", scores.has("total_10") ? scores.get("total_10").asDouble() : null);
                map.put("totalScore4", scores.has("total_4") ? scores.get("total_4").asDouble() : null);
                map.put("letterScore", scores.has("letter") ? scores.get("letter").asText() : "");
                map.put("passed", scores.has("passed") ? scores.get("passed").asBoolean() : false);
            }

            result.add(map);
        }
        return result;
    }

    public List<CreditClassResponseDto> getStudentSchedule(UUID studentId) {
        // 1. Get all enrolled student_credit_classes
        List<StudentCreditClass> enrolled = studentCreditClassRepository.findByStudentId(studentId);

        if (enrolled.isEmpty()) {
            return new ArrayList<>();
        }

        // 2. Fetch CreditClass details and map to DTO
        return enrolled.stream().map(scc -> {
            return creditClassRepository.findById(scc.getCreditClassId()).map(cc -> {
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

                // Convert Schedule JSON
                ObjectMapper mapper = new ObjectMapper();
                try {
                    if (cc.getSchedule() != null) {
                        dto.setSchedule(
                                mapper.convertValue(cc.getSchedule(), new TypeReference<List<ScheduleItemDto>>() {
                                }));
                    }
                } catch (Exception e) {
                    // ignore
                }

                // Get Subject Name
                subjectRepository.findBySubjectCode(cc.getSubjectCode())
                        .ifPresent(subject -> dto.setName(subject.getName()));

                // Get Teacher Name (if needed for schedule display, currently DTO has ID)
                // For now, assume teacherId is enough or frontend fetches teacher details if
                // needed.
                // Or we could enrich teacher name here if DTO supported it.

                return dto;
            }).orElse(null);
        })
                .filter(dto -> dto != null)
                .collect(Collectors.toList());
    }

    public List<StudentCreditClassResponseDto> getAllStudentCreditClasses() {
        return studentCreditClassRepository.findAll().stream()
                .map(StudentCreditClassResponseDto::new)
                .collect(Collectors.toList());
    }

    public StudentCreditClassResponseDto getStudentCreditClassById(UUID id) {
        StudentCreditClass studentCreditClass = studentCreditClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký lớp tín chỉ với ID: " + id));
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

    public StudentCreditClassResponseDto createStudentCreditClass(
            CreateStudentCreditClassDto createStudentCreditClassDto) {

        // Check if credit class exists
        CreditClass creditClass = creditClassRepository.findById(createStudentCreditClassDto.getCreditClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp tín chỉ"));

        // Check capacity
        int currentEnrollment = studentCreditClassRepository
                .findByCreditClassId(createStudentCreditClassDto.getCreditClassId()).size();
        if (currentEnrollment >= creditClass.getQuantity()) {
            throw new RuntimeException("Lớp học phần đã đầy");
        }

        // Check if this student-creditClass combination already exists
        if (studentCreditClassRepository.findByStudentIdAndCreditClassId(
                createStudentCreditClassDto.getStudentId(),
                createStudentCreditClassDto.getCreditClassId()).isPresent()) {
            throw new RuntimeException("Sinh viên đã đăng ký lớp học phần này");
        }

        StudentCreditClass studentCreditClass = new StudentCreditClass();
        studentCreditClass.setStudentId(createStudentCreditClassDto.getStudentId());
        studentCreditClass.setCreditClassId(createStudentCreditClassDto.getCreditClassId());
        studentCreditClass.setScores(createStudentCreditClassDto.getScores());
        studentCreditClass.setExamSchedule(createStudentCreditClassDto.getExamSchedule());

        StudentCreditClass savedStudentCreditClass = studentCreditClassRepository.save(studentCreditClass);
        return new StudentCreditClassResponseDto(savedStudentCreditClass);
    }

    public StudentCreditClassResponseDto updateStudentCreditClass(UUID id,
            UpdateStudentCreditClassDto updateStudentCreditClassDto) {
        StudentCreditClass studentCreditClass = studentCreditClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đăng ký lớp tín chỉ với ID: " + id));

        if (updateStudentCreditClassDto.getStudentId() != null) {
            studentCreditClass.setStudentId(updateStudentCreditClassDto.getStudentId());
        }

        if (updateStudentCreditClassDto.getCreditClassId() != null) {
            // Check if the new combination already exists (excluding current record)
            if (updateStudentCreditClassDto.getStudentId() != null
                    || updateStudentCreditClassDto.getCreditClassId() != null) {
                UUID checkStudentId = updateStudentCreditClassDto.getStudentId() != null
                        ? updateStudentCreditClassDto.getStudentId()
                        : studentCreditClass.getStudentId();
                UUID checkCreditClassId = updateStudentCreditClassDto.getCreditClassId() != null
                        ? updateStudentCreditClassDto.getCreditClassId()
                        : studentCreditClass.getCreditClassId();

                studentCreditClassRepository.findByStudentIdAndCreditClassId(checkStudentId, checkCreditClassId)
                        .ifPresent(existingStudentCreditClass -> {
                            if (!existingStudentCreditClass.getId().equals(id)) {
                                throw new RuntimeException("Sinh viên đã đăng ký lớp học phần này");
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
            throw new RuntimeException("Không tìm thấy đăng ký lớp tín chỉ với ID: " + id);
        }
        studentCreditClassRepository.deleteById(id);
    }
}
