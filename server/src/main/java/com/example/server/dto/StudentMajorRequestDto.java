package com.example.server.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class StudentMajorRequestDto {

    @NotNull(message = "Student_id không được để trống.")
    private UUID studentId;

    @NotNull(message = "Major_id không được để trống.")
    private UUID majorId;

    private UUID specializationId;

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
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
