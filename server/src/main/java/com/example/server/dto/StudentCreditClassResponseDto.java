package com.example.server.dto;

import com.example.server.entity.StudentCreditClass;

import java.time.LocalDateTime;
import java.util.UUID;

public class StudentCreditClassResponseDto {

    private UUID id;
    private UUID studentId;
    private UUID creditClassId;
    private String scores;
    private String examSchedule;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public StudentCreditClassResponseDto() {
    }

    public StudentCreditClassResponseDto(StudentCreditClass studentCreditClass) {
        this.id = studentCreditClass.getId();
        this.studentId = studentCreditClass.getStudentId();
        this.creditClassId = studentCreditClass.getCreditClassId();
        this.scores = studentCreditClass.getScores();
        this.examSchedule = studentCreditClass.getExamSchedule();
        this.createdAt = studentCreditClass.getCreatedAt();
        this.updatedAt = studentCreditClass.getUpdatedAt();
    }

    public StudentCreditClassResponseDto(UUID id, UUID studentId, UUID creditClassId, String scores, String examSchedule, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.creditClassId = creditClassId;
        this.scores = scores;
        this.examSchedule = examSchedule;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
