package com.example.server.dto;

import jakarta.validation.constraints.Size;

import java.util.UUID;

public class UpdateStudentDto {

    @Size(max = 200, message = "Mã sinh viên không được vượt quá 200 ký tự")
    private String studentCode;

    private UUID userId;

    // Constructors
    public UpdateStudentDto() {
    }

    public UpdateStudentDto(String studentCode, UUID userId) {
        this.studentCode = studentCode;
        this.userId = userId;
    }

    // Getters and Setters
    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
