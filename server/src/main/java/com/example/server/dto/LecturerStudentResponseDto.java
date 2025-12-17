package com.example.server.dto;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.UUID;

public class LecturerStudentResponseDto {
    private UUID studentId;
    private String studentName;
    private String studentCode;
    private JsonNode scores;

    public LecturerStudentResponseDto() {
    }

    public LecturerStudentResponseDto(UUID studentId, String studentName, String studentCode, JsonNode scores) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
        this.scores = scores;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public JsonNode getScores() {
        return scores;
    }

    public void setScores(JsonNode scores) {
        this.scores = scores;
    }
}
