package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateStudentDto {

    @NotBlank(message = "Mã sinh viên không được để trống")
    @Size(max = 200, message = "Mã sinh viên không được vượt quá 200 ký tự")
    private String studentCode;

    @NotNull(message = "User ID không được để trống")
    private UUID userId;

    // Constructors
    public CreateStudentDto() {
    }

    public CreateStudentDto(String studentCode, UUID userId) {
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
