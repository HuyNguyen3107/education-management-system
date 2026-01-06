package com.example.server.dto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public class TuitionCalculationResponseDto {

    private UUID studentId;
    private String studentCode;
    private String academicYear;
    private Integer currentYearNumber;
    private String currentSemester;
    private String currentYear;
    private Double totalCredits;
    private Double pricePerCredit;
    private Double totalTuition;
    private UUID tuitionId;
    private List<Map<String, Object>> subjectDetails;

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Integer getCurrentYearNumber() {
        return currentYearNumber;
    }

    public void setCurrentYearNumber(Integer currentYearNumber) {
        this.currentYearNumber = currentYearNumber;
    }

    public String getCurrentSemester() {
        return currentSemester;
    }

    public void setCurrentSemester(String currentSemester) {
        this.currentSemester = currentSemester;
    }

    public String getCurrentYear() {
        return currentYear;
    }

    public void setCurrentYear(String currentYear) {
        this.currentYear = currentYear;
    }

    public Double getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(Double totalCredits) {
        this.totalCredits = totalCredits;
    }

    public Double getPricePerCredit() {
        return pricePerCredit;
    }

    public void setPricePerCredit(Double pricePerCredit) {
        this.pricePerCredit = pricePerCredit;
    }

    public Double getTotalTuition() {
        return totalTuition;
    }

    public void setTotalTuition(Double totalTuition) {
        this.totalTuition = totalTuition;
    }

    public UUID getTuitionId() {
        return tuitionId;
    }

    public void setTuitionId(UUID tuitionId) {
        this.tuitionId = tuitionId;
    }

    public List<Map<String, Object>> getSubjectDetails() {
        return subjectDetails;
    }

    public void setSubjectDetails(List<Map<String, Object>> subjectDetails) {
        this.subjectDetails = subjectDetails;
    }
}
