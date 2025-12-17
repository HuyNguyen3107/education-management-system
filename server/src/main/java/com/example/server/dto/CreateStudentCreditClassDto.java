package com.example.server.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateStudentCreditClassDto {

    @NotNull(message = "Student ID is required")
    private UUID studentId;

    @NotNull(message = "Credit Class ID is required")
    private UUID creditClassId;

    private JsonNode scores;

    private JsonNode examSchedule;

    // Constructors
    public CreateStudentCreditClassDto() {
    }

    public CreateStudentCreditClassDto(UUID studentId, UUID creditClassId, JsonNode scores, JsonNode examSchedule) {
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

    public JsonNode getScores() {
        return scores;
    }

    public void setScores(JsonNode scores) {
        this.scores = scores;
    }

    public JsonNode getExamSchedule() {
        return examSchedule;
    }

    public void setExamSchedule(JsonNode examSchedule) {
        this.examSchedule = examSchedule;
    }
}
