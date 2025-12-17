package com.example.server.service;

import com.example.server.dto.AspirationRegisterRequestDto;
import com.example.server.dto.AspirationRegisterResponseDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.entity.*;
import com.example.server.repository.AspirationRegisterRepository;
import com.example.server.repository.CreditClassRepository;
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
import java.util.List;
import java.util.Optional;
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

    public List<SubjectResponseDto> getAvailableSubjects(UUID studentId) {
        // 1. Check Time Window
        TimeRegister activePeriod = findActiveWishlistPeriod();
        if (activePeriod == null) {
            throw new RuntimeException("Hiện không trong thời gian đăng ký nguyện vọng.");
        }

        // 2. Get Student Info
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên"));

        // 3. Parse Semester Info
        String typeSemester = activePeriod.getTypeSemester(); // e.g., "Học kỳ 1 năm 2024-2025"
        SemesterInfo semesterInfo = parseSemesterString(typeSemester);

        // 4. Parse Student Academic Year
        String academicYear = student.getAcademicYear(); // e.g., "2021-2025"
        int startYear = parseStartYear(academicYear);

        // 5. Calculate Student Year and Program Semester
        int currentStudentYear = semesterInfo.year - startYear + 1;
        // Assuming 2 semesters per year for the calculation logic
        // Program Semester = (Year - 1) * 2 + SemesterIndex
        int programSemester = (currentStudentYear - 1) * 2 + semesterInfo.semesterIndex;

        List<Subject> subjects = new ArrayList<>();

        if (semesterInfo.semesterIndex == 1 || semesterInfo.semesterIndex == 2) {
            // Main Semester Logic
            StudentMajor studentMajor = studentMajorRepository.findByStudentId(studentId).stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Sinh viên chưa có chuyên ngành"));

            // Find subjects for this Major/Specialization and Semester
            // Using a helper method to filter in memory or we could add a repository method
            List<Subject> allSubjects = subjectRepository.findByMajorIdOrSpecializationId(
                    studentMajor.getMajorId(), studentMajor.getSpecializationId());

            String targetSemesterStr = String.valueOf(programSemester);
            subjects = allSubjects.stream()
                    .filter(s -> s.getSemester().equals(targetSemesterStr))
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
                        subjectOpt.ifPresent(subjects::add);
                    }
                }
            }
        }

        return subjects.stream()
                .map(SubjectResponseDto::new)
                .collect(Collectors.toList());
    }

    private TimeRegister findActiveWishlistPeriod() {
        List<TimeRegister> periods = timeRegisterRepository.findByTypeRegister("wishlist_registration");
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATE_FORMAT);

        for (TimeRegister p : periods) {
            try {
                LocalDate start = LocalDate.parse(p.getOpenTime(), formatter);
                LocalDate end = LocalDate.parse(p.getEndTime(), formatter);
                if (!now.isBefore(start) && !now.isAfter(end)) {
                    return p;
                }
            } catch (Exception e) {
                // Ignore parsing errors, maybe log them
                continue;
            }
        }
        return null;
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
        // Example: "Học kỳ 1 năm 2024-2025"
        // Regex to extract semester and first year
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

        // Strategy 1: Look for "grade": "F" or "letter_grade": "F"
        if (scores.has("grade") && "F".equalsIgnoreCase(scores.get("grade").asText()))
            return true;
        if (scores.has("letter_grade") && "F".equalsIgnoreCase(scores.get("letter_grade").asText()))
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
