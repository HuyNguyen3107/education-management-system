package com.example.server.service;

import com.example.server.dto.TuitionCalculationResponseDto;
import com.example.server.entity.Student;
import com.example.server.entity.StudentCreditClass;
import com.example.server.entity.Subject;
import com.example.server.entity.Tuition;
import com.example.server.repository.StudentCreditClassRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.SubjectRepository;
import com.example.server.repository.TuitionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TuitionCalculationService {

    private final StudentRepository studentRepository;
    private final StudentCreditClassRepository studentCreditClassRepository;
    private final SubjectRepository subjectRepository;
    private final TuitionRepository tuitionRepository;

    public TuitionCalculationService(
            StudentRepository studentRepository,
            StudentCreditClassRepository studentCreditClassRepository,
            SubjectRepository subjectRepository,
            TuitionRepository tuitionRepository) {
        this.studentRepository = studentRepository;
        this.studentCreditClassRepository = studentCreditClassRepository;
        this.subjectRepository = subjectRepository;
        this.tuitionRepository = tuitionRepository;
    }

    /**
     * Calculate tuition for a student based on their current academic progress
     * and registered credit classes
     */
    public List<TuitionCalculationResponseDto> calculateStudentTuition(UUID studentId) {
        // Get student with user information
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với id: " + studentId));

        // Get student's academic year from user
        String academicYear = student.getUser() != null ? student.getUser().getAcademicYear() : null;
        if (academicYear == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Sinh viên chưa có niên khóa.");
        }

        // Parse academic year (format: "YYYY-YYYY")
        String[] years = academicYear.split("-");
        if (years.length != 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Định dạng niên khóa không hợp lệ. Định dạng mong muốn: YYYY-YYYY");
        }

        int startYear = Integer.parseInt(years[0].trim());
        int endYear = Integer.parseInt(years[1].trim());

        // Get current date
        LocalDate currentDate = LocalDate.now();

        // Calculate current year and semester for the student
        StudentProgress progress = calculateStudentProgress(startYear, endYear, currentDate);

        // Get all student credit classes
        List<StudentCreditClass> studentCreditClasses = studentCreditClassRepository.findByStudentId(studentId);

        // Group credit classes by subject to get unique subjects with their credits
        Map<UUID, Subject> subjectMap = new HashMap<>();
        for (StudentCreditClass scc : studentCreditClasses) {
            // Get credit class to get subject code
            var creditClass = scc.getCreditClass();
            if (creditClass != null) {
                String subjectCode = creditClass.getSubjectCode();
                Subject subject = subjectRepository.findBySubjectCode(subjectCode).orElse(null);
                if (subject != null) {
                    subjectMap.put(subject.getId(), subject);
                }
            }
        }

        // Calculate total credits
        double totalCredits = subjectMap.values().stream()
                .mapToDouble(subject -> subject.getNumberOfCredit() != null ? subject.getNumberOfCredit() : 0.0)
                .sum();

        // Find applicable tuition for current semester/year
        Tuition applicableTuition = findApplicableTuition(
                progress.currentYear,
                progress.currentSemester,
                academicYear);

        if (applicableTuition == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy học phí cho năm học " + progress.currentYear + 
                    " và học kỳ " + progress.currentSemester);
        }

        // Calculate tuition amount
        double tuitionAmount = totalCredits * applicableTuition.getPrice();

        // Build response
        TuitionCalculationResponseDto response = new TuitionCalculationResponseDto();
        response.setStudentId(studentId);
        response.setStudentCode(student.getStudentCode());
        response.setAcademicYear(academicYear);
        response.setCurrentYearNumber(progress.yearNumber);
        response.setCurrentSemester(progress.currentSemester);
        response.setCurrentYear(progress.currentYear);
        response.setTotalCredits(totalCredits);
        response.setPricePerCredit(applicableTuition.getPrice());
        response.setTotalTuition(tuitionAmount);
        response.setTuitionId(applicableTuition.getId());
        response.setSubjectDetails(subjectMap.values().stream()
                .map(this::mapSubjectToDetail)
                .collect(Collectors.toList()));

        return List.of(response);
    }

    /**
     * Calculate student's current academic progress (year and semester)
     * based on their academic year start/end and current date
     */
    private StudentProgress calculateStudentProgress(int startYear, int endYear, LocalDate currentDate) {
        StudentProgress progress = new StudentProgress();

        // Calculate year number (1-5 for 5-year program)
        int yearNumber = currentDate.getYear() - startYear + 1;
        
        // Clamp year number to valid range
        if (yearNumber < 1) yearNumber = 1;
        if (yearNumber > 5) yearNumber = 5;

        progress.yearNumber = yearNumber;
        progress.currentYear = String.valueOf(currentDate.getYear());

        // Determine semester based on month
        // Semester 1: September to February (months 9-2)
        // Semester 2: March to August (months 3-8)
        int month = currentDate.getMonthValue();
        if (month >= 9 || month <= 2) {
            progress.currentSemester = "1";
        } else {
            progress.currentSemester = "2";
        }

        return progress;
    }

    /**
     * Find applicable tuition for given year, semester, and academic year
     */
    private Tuition findApplicableTuition(String year, String semester, String academicYear) {
        // First try to find exact match for year and semester
        List<Tuition> tuitions = tuitionRepository.findAll();
        
        for (Tuition tuition : tuitions) {
            // Match academic year
            if (tuition.getAcademicYear().equals(academicYear)) {
                // Match year
                if (tuition.getYear().equals(year)) {
                    // Match semester (normalize semester format)
                    String tuitionSemester = normalizeSemester(tuition.getSemester());
                    String targetSemester = normalizeSemester(semester);
                    if (tuitionSemester.equals(targetSemester)) {
                        return tuition;
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Normalize semester string to compare different formats
     * "Học kỳ 1" -> "1", "1" -> "1", "Fall" -> "1"
     */
    private String normalizeSemester(String semester) {
        String s = semester.toLowerCase().trim();
        if (s.contains("học kỳ") || s.contains("hk")) {
            return s.replaceAll("[^0-9]", "");
        }
        if (s.contains("fall") || s.contains("autumn")) {
            return "1";
        }
        if (s.contains("spring")) {
            return "2";
        }
        if (s.matches("\\d+")) {
            return s;
        }
        return s;
    }

    private Map<String, Object> mapSubjectToDetail(Subject subject) {
        Map<String, Object> detail = new HashMap<>();
        detail.put("subjectCode", subject.getSubjectCode());
        detail.put("subjectName", subject.getName());
        detail.put("credits", subject.getNumberOfCredit());
        detail.put("semester", subject.getSemester());
        return detail;
    }

    private static class StudentProgress {
        int yearNumber; // 1-5
        String currentYear; // "2025"
        String currentSemester; // "1" or "2"
    }
}
