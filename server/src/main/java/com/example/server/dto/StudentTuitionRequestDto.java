package com.example.server.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class StudentTuitionRequestDto {

    @NotNull(message = "Student_id không được để trống.")
    private UUID studentId;

    @NotNull(message = "Tuition_id không được để trống.")
    private UUID tuitionId;

    private Double endow;

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getTuitionId() {
        return tuitionId;
    }

    public void setTuitionId(UUID tuitionId) {
        this.tuitionId = tuitionId;
    }

    public Double getEndow() {
        return endow;
    }

    public void setEndow(Double endow) {
        this.endow = endow;
    }
}
