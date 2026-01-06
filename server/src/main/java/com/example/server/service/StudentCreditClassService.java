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
    private final PrerequisiteSubjectRepository prerequisiteSubjectRepository;

    public StudentCreditClassService(StudentCreditClassRepository studentCreditClassRepository,
            TimeRegisterRepository timeRegisterRepository,
            AspirationRegisterRepository aspirationRegisterRepository,
            CreditClassRepository creditClassRepository,
            SubjectRepository subjectRepository,
            TeacherRepository teacherRepository,
            PrerequisiteSubjectRepository prerequisiteSubjectRepository) {
        this.studentCreditClassRepository = studentCreditClassRepository;
        this.timeRegisterRepository = timeRegisterRepository;
        this.aspirationRegisterRepository = aspirationRegisterRepository;
        this.creditClassRepository = creditClassRepository;
        this.subjectRepository = subjectRepository;
        this.teacherRepository = teacherRepository;
        this.prerequisiteSubjectRepository = prerequisiteSubjectRepository;
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
            // Try ISO datetime format first (e.g., 2025-12-21T09:00:00.000Z)
            if (dateStr.contains("T")) {
                java.time.OffsetDateTime odt = java.time.OffsetDateTime.parse(dateStr);
                return odt.toLocalDate();
            }
        } catch (Exception e) {
            // Continue to try other formats
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

        // Determine current semester based on current date
        String currentSemester = determineCurrentSemester();
        LocalDate now = LocalDate.now();

        for (StudentCreditClass scc : enrolled) {
            CreditClass cc = creditClassRepository.findById(scc.getCreditClassId()).orElse(null);
            if (cc == null)
                continue;

            // Only include classes from the current semester
            if (!cc.getSemester().equals(currentSemester))
                continue;

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

            String subjectName = subjectRepository.findBySubjectCode(cc.getSubjectCode())
                    .map(Subject::getName).orElse("Không xác định");

            for (JsonNode exam : exams) {
                Map<String, Object> map = new HashMap<>();
                map.put("subjectCode", cc.getSubjectCode());
                map.put("subjectName", subjectName);
                map.put("group", cc.getGroup());
                map.put("quantity", cc.getQuantity()); // Sĩ số
                map.put("semester", cc.getSemester()); // Add semester for display

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

        // Validate prerequisites
        Optional<Subject> subjectOpt = subjectRepository.findBySubjectCode(creditClass.getSubjectCode());
        if (subjectOpt.isPresent()) {
            Subject subject = subjectOpt.get();
            if (!validatePrerequisites(subject, createStudentCreditClassDto.getStudentId())) {
                // Get prerequisites for error message
                List<PrerequisiteSubject> prerequisites = prerequisiteSubjectRepository
                        .findByRegisterCode(subject.getSubjectCode());
                StringBuilder errorMsg = new StringBuilder("Bạn chưa đáp ứng điều kiện tiên quyết cho môn này. ");
                errorMsg.append("Bạn cần học và đạt điểm qua (không phải F) các môn: ");
                for (int i = 0; i < prerequisites.size(); i++) {
                    if (i > 0) errorMsg.append(", ");
                    errorMsg.append(prerequisites.get(i).getPrerequisiteCode());
                }
                throw new RuntimeException(errorMsg.toString());
            }
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

    /**
     * Validate that a student has passed all prerequisites for a subject
     * @param subject The subject to check prerequisites for
     * @param studentId The student ID
     * @return true if all prerequisites are met, false otherwise
     */
    private boolean validatePrerequisites(Subject subject, UUID studentId) {
        // Get all prerequisites for this subject
        List<PrerequisiteSubject> prerequisites = prerequisiteSubjectRepository
                .findByRegisterCode(subject.getSubjectCode());

        // If no prerequisites, subject is available
        if (prerequisites.isEmpty()) {
            return true;
        }

        // Check each prerequisite
        for (PrerequisiteSubject prerequisite : prerequisites) {
            String prerequisiteCode = prerequisite.getPrerequisiteCode();

            // Check if student has passed this prerequisite subject
            if (!hasPassedPrerequisite(studentId, prerequisiteCode)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if a student has passed a prerequisite subject
     * @param studentId The student ID
     * @param subjectCode The subject code to check
     * @return true if student has passed the subject (not F grade), false otherwise
     */
    private boolean hasPassedPrerequisite(UUID studentId, String subjectCode) {
        // Get all credit classes the student has enrolled in
        List<StudentCreditClass> studentCreditClasses = studentCreditClassRepository
                .findByStudentId(studentId);

        // Check each credit class to see if it matches the prerequisite subject
        for (StudentCreditClass scc : studentCreditClasses) {
            Optional<CreditClass> creditClassOpt = creditClassRepository.findById(scc.getCreditClassId());
            if (creditClassOpt.isPresent()) {
                CreditClass cc = creditClassOpt.get();
                if (cc.getSubjectCode().equals(subjectCode)) {
                    // Found the subject, check if student passed (not failed)
                    return !isFailed(scc.getScores());
                }
            }
        }

        // Student hasn't taken this prerequisite subject yet
        return false;
    }

    /**
     * Check if a score indicates a failed grade
     * @param scores The scores JSON node
     * @return true if failed (F grade or score < 4.0), false otherwise
     */
    private boolean isFailed(JsonNode scores) {
        if (scores == null)
            return false;
        // Check for specific "F" grade or score < 4.0
        // Structure assumption: simple key-value or complex object

        // Strategy 1: Look for "grade": "F" or "letter_grade": "F"
        if (scores.has("grade") && "F".equalsIgnoreCase(scores.get("grade").asText()))
            return true;
        if (scores.has("letter_grade") && "F".equalsIgnoreCase(scores.get("letter_grade").asText()))
            return true;
        if (scores.has("letter") && "F".equalsIgnoreCase(scores.get("letter").asText()))
            return true;

        // Strategy 2: Look for "final_score" or "final" < 4.0
        double finalScore = -1;
        if (scores.has("final_score"))
            finalScore = scores.get("final_score").asDouble();
        else if (scores.has("final"))
            finalScore = scores.get("final").asDouble();

        if (finalScore >= 0 && finalScore < 4.0)
            return true;

        return false;
    }
}
