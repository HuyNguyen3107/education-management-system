package com.example.server.service;

import com.example.server.dto.AspirationRegisterRequestDto;
import com.example.server.dto.AspirationRegisterResponseDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.entity.*;
import com.example.server.repository.AspirationRegisterRepository;
import com.example.server.repository.CreditClassRepository;
import com.example.server.repository.PrerequisiteSubjectRepository;
import com.example.server.repository.StudentCreditClassRepository;
import com.example.server.repository.StudentMajorRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.SubjectRepository;
import com.example.server.repository.TimeRegisterRepository;
import com.example.server.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AspirationRegisterService {

    @Autowired
    private AspirationRegisterRepository aspirationRegisterRepository;

    @Autowired
    private TimeRegisterRepository timeRegisterRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentMajorRepository studentMajorRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudentCreditClassRepository studentCreditClassRepository;

    @Autowired
    private CreditClassRepository creditClassRepository;

    @Autowired
    private PrerequisiteSubjectRepository prerequisiteSubjectRepository;

    private static final String DATE_FORMAT = "dd/MM/yyyy";

    public List<AspirationRegisterResponseDto> getAll() {
        return aspirationRegisterRepository.findAll().stream()
                .map(AspirationRegisterResponseDto::new)
                .collect(Collectors.toList());
    }

    public AspirationRegisterResponseDto getById(UUID id) {
        AspirationRegister aspiration = aspirationRegisterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyện vọng"));
        return new AspirationRegisterResponseDto(aspiration);
    }

    public List<AspirationRegisterResponseDto> getAspirationsByStudentId(UUID studentId) {
        return aspirationRegisterRepository.findByStudentId(studentId).stream()
                .map(AspirationRegisterResponseDto::new)
                .collect(Collectors.toList());
    }

    public AspirationRegisterResponseDto createAspiration(AspirationRegisterRequestDto dto) {
        // Validate that the provided ID belongs to an existing student.
        // Support both use-cases:
        // - Admin pages send Student.id  -> check in StudentRepository
        // - Student self-service pages send User.id -> check in UserRepository
        boolean existsInStudentTable = studentRepository.existsById(dto.getStudentId());
        boolean existsInUserTable = userRepository.existsById(dto.getStudentId());
 
        if (!existsInStudentTable && !existsInUserTable) {
            throw new RuntimeException("Không tìm thấy sinh viên");
        }

        // Get subject being registered
        Optional<Subject> subjectOpt = subjectRepository.findBySubjectCode(dto.getSubjectCode());
        if (subjectOpt.isEmpty()) {
            throw new RuntimeException("Không tìm thấy môn học với mã: " + dto.getSubjectCode());
        }
        Subject subject = subjectOpt.get();

        // Get student ID (convert from User ID if necessary)
        UUID studentId = dto.getStudentId();
        if (existsInUserTable && !existsInStudentTable) {
            // If it's a User ID, get the corresponding Student ID
            Student studentRecord = studentRepository.findByUserId(studentId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin sinh viên"));
            studentId = studentRecord.getId();
        }

        // Validate prerequisites
        if (!validatePrerequisites(subject, studentId)) {
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

        AspirationRegister aspiration = new AspirationRegister();
        aspiration.setStudentId(dto.getStudentId());
        aspiration.setSubjectCode(dto.getSubjectCode());
        aspiration.setReason(dto.getReason());
        aspiration.setSemester(dto.getSemester());

        AspirationRegister saved = aspirationRegisterRepository.save(aspiration);
        return new AspirationRegisterResponseDto(saved);
    }

    public AspirationRegisterResponseDto updateAspiration(UUID id, AspirationRegisterRequestDto dto) {
        AspirationRegister aspiration = aspirationRegisterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyện vọng"));

        aspiration.setSubjectCode(dto.getSubjectCode());
        aspiration.setStudentId(dto.getStudentId());
        aspiration.setReason(dto.getReason());
        aspiration.setSemester(dto.getSemester());

        AspirationRegister updated = aspirationRegisterRepository.save(aspiration);
        return new AspirationRegisterResponseDto(updated);
    }

    public void deleteAspiration(UUID id) {
        if (!aspirationRegisterRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy nguyện vọng");
        }
        aspirationRegisterRepository.deleteById(id);
    }

    public List<SubjectResponseDto> getAvailableSubjects(UUID userId) {
        // 1. Check Time Window
        TimeRegister activePeriod = findActiveWishlistPeriod();
        if (activePeriod == null) {
            throw new RuntimeException("Hiện không trong thời gian đăng ký nguyện vọng.");
        }

        // 2. Get User Info
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // 3. Get Student record from User (Student table has separate ID)
        Student studentRecord = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin sinh viên. Vui lòng liên hệ phòng đào tạo."));
        UUID studentId = studentRecord.getId();

        // 4. Parse Semester Info
        String typeSemester = activePeriod.getTypeSemester(); // e.g., "Học kỳ 1 năm 2024-2025"
        SemesterInfo semesterInfo = parseSemesterString(typeSemester);

        // 5. Parse Student Academic Year
        String academicYear = user.getAcademicYear(); // e.g., "2021-2025"
        int startYear = parseStartYear(academicYear);

        // 6. Calculate Student Year and Program Semester
        int currentStudentYear = semesterInfo.year - startYear + 1;
        // Assuming 2 semesters per year for the calculation logic
        // Program Semester = (Year - 1) * 2 + SemesterIndex
        int programSemester = (currentStudentYear - 1) * 2 + semesterInfo.semesterIndex;

        List<Subject> subjects = new ArrayList<>();

        // Get all subjects that match the criteria first
        List<Subject> potentialSubjects = new ArrayList<>();

        if (semesterInfo.semesterIndex == 1 || semesterInfo.semesterIndex == 2) {
            // Main Semester Logic - Use Student.id (not User.id) to find StudentMajor
            Optional<StudentMajor> studentMajorOpt = studentMajorRepository.findByStudentId(studentId).stream()
                    .findFirst();
            
            if (studentMajorOpt.isEmpty()) {
                throw new RuntimeException("Sinh viên chưa được gán chuyên ngành. Vui lòng liên hệ phòng đào tạo để được hỗ trợ.");
            }
            
            StudentMajor studentMajor = studentMajorOpt.get();

            // Find subjects for this Major/Specialization and Semester
            // Using a helper method to filter in memory or we could add a repository method
            List<Subject> allSubjects = subjectRepository.findByMajorIdOrSpecializationId(
                    studentMajor.getMajorId(), studentMajor.getSpecializationId());

            String targetSemesterStr = String.valueOf(programSemester);
            potentialSubjects = allSubjects.stream()
                    .filter(s -> s.getSemester().equals(targetSemesterStr))
                    .collect(Collectors.toList());

            // EXCLUDE subjects that student has already PASSED
            List<StudentCreditClass> enrolledClasses = studentCreditClassRepository.findByStudentId(studentId);
            Set<String> passedSubjectCodes = new HashSet<>();
            
            for (StudentCreditClass scc : enrolledClasses) {
                if (!isFailed(scc.getScores()) && scc.getScores() != null) {
                    // Student passed this subject
                    Optional<CreditClass> creditClassOpt = creditClassRepository.findById(scc.getCreditClassId());
                    if (creditClassOpt.isPresent()) {
                        passedSubjectCodes.add(creditClassOpt.get().getSubjectCode());
                    }
                }
            }
            
            // Filter out passed subjects
            potentialSubjects = potentialSubjects.stream()
                    .filter(s -> !passedSubjectCodes.contains(s.getSubjectCode()))
                    .collect(Collectors.toList());

        } else {
            // Sub Semester (Summer/Winter) Logic - Failed Subjects
            List<StudentCreditClass> enrolledClasses = studentCreditClassRepository.findByStudentId(studentId);

            for (StudentCreditClass scc : enrolledClasses) {
                if (isFailed(scc.getScores())) {
                    // Find subject
                    Optional<CreditClass> creditClassOpt = creditClassRepository.findById(scc.getCreditClassId());
                    if (creditClassOpt.isPresent()) {
                        CreditClass cc = creditClassOpt.get();
                        Optional<Subject> subjectOpt = subjectRepository.findBySubjectCode(cc.getSubjectCode());
                        subjectOpt.ifPresent(potentialSubjects::add);
                    }
                }
            }
        }

        // Filter subjects based on prerequisite validation
        subjects = potentialSubjects.stream()
                .filter(subject -> validatePrerequisites(subject, studentId))
                .collect(Collectors.toList());

        return subjects.stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    private TimeRegister findActiveWishlistPeriod() {
        List<TimeRegister> periods = timeRegisterRepository.findByTypeRegister("wishlist_registration");
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
        // Try dd/MM/yyyy format first
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(DATE_FORMAT));
        } catch (Exception e) {
            // Try ISO format (e.g., 2024-12-20T00:00:00.000Z)
            try {
                return LocalDate.parse(dateStr.substring(0, 10));
            } catch (Exception ex) {
                // Try default LocalDate parsing
                try {
                    return LocalDate.parse(dateStr);
                } catch (Exception exc) {
                    return null;
                }
            }
        }
    }

    private static class SemesterInfo {
        int semesterIndex;
        int year;

        SemesterInfo(int s, int y) {
            this.semesterIndex = s;
            this.year = y;
        }
    }

    private SemesterInfo parseSemesterString(String typeSemester) {
        if (typeSemester == null || typeSemester.trim().isEmpty()) {
            throw new RuntimeException("Định dạng học kỳ không hợp lệ: " + typeSemester);
        }

        // Handle new format: SEMESTER_1, SEMESTER_2, SUMMER
        int currentYear = LocalDate.now().getYear();
        if (typeSemester.equals("SEMESTER_1")) {
            return new SemesterInfo(1, currentYear);
        } else if (typeSemester.equals("SEMESTER_2")) {
            return new SemesterInfo(2, currentYear);
        } else if (typeSemester.equals("SUMMER")) {
            return new SemesterInfo(3, currentYear); // Summer semester
        }

        // Handle old format: "Học kỳ 1 năm 2024-2025"
        Pattern pattern = Pattern.compile("Học kỳ (\\d+) năm (\\d{4})");
        Matcher matcher = pattern.matcher(typeSemester);

        if (matcher.find()) {
            int sem = Integer.parseInt(matcher.group(1));
            int year = Integer.parseInt(matcher.group(2));
            return new SemesterInfo(sem, year);
        }

        // Fallback or error
        throw new RuntimeException("Định dạng học kỳ không hợp lệ: " + typeSemester);
    }

    private int parseStartYear(String academicYear) {
        // Example: "2021-2025"
        try {
            return Integer.parseInt(academicYear.split("-")[0]);
        } catch (Exception e) {
            throw new RuntimeException("Định dạng niên khóa không hợp lệ: " + academicYear);
        }
    }

    private boolean isFailed(JsonNode scores) {
        if (scores == null)
            return false;
        // Check for specific "F" grade or score < 4.0
        // Structure assumption: simple key-value or complex object

        // Strategy 1: Look for "grade": "F" or "letter_grade": "F" or "letter": "F"
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
}
