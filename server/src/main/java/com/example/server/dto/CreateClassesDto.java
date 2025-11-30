package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateClassesDto {

    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 200, message = "Mã lớp không được vượt quá 200 ký tự")
    private String classCode;

    @NotNull(message = "Teacher ID không được để trống")
    private UUID teacherId;

    private UUID majorId;

    private UUID specializationId;

    // Constructors
    public CreateClassesDto() {
    }

    public CreateClassesDto(String classCode, UUID teacherId, UUID majorId, UUID specializationId) {
        this.classCode = classCode;
        this.teacherId = teacherId;
        this.majorId = majorId;
        this.specializationId = specializationId;
    }

    // Getters and Setters
    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public UUID getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(UUID teacherId) {
        this.teacherId = teacherId;
    }

    public UUID getMajorId() {
        return majorId;
    }

    public void setMajorId(UUID majorId) {
        this.majorId = majorId;
    }

    public UUID getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(UUID specializationId) {
        this.specializationId = specializationId;
    }
}
