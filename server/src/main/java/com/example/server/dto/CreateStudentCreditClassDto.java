package com.example.server.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateStudentCreditClassDto {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Credit Class ID is required")
    private UUID creditClassId;

    private String scores;

    private String examSchedule;

    // Constructors
    public CreateStudentCreditClassDto() {
    }

    public CreateStudentCreditClassDto(UUID studentId, UUID creditClassId, String scores, String examSchedule) {
        this.studentId = studentId;
        this.creditClassId = creditClassId;
        this.scores = scores;
        this.examSchedule = examSchedule;
    }

    // Getters and Setters
    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getCreditClassId() {
        return creditClassId;
    }

    public void setCreditClassId(UUID creditClassId) {
        this.creditClassId = creditClassId;
    }

    public String getScores() {
        return scores;
    }

    public void setScores(String scores) {
        this.scores = scores;
    }

    public String getExamSchedule() {
        return examSchedule;
    }

    public void setExamSchedule(String examSchedule) {
        this.examSchedule = examSchedule;
    }
}
