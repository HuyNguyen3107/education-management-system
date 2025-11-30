package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AspirationRegisterRequestDto {

    @NotBlank(message = "Mã môn học không được để trống.")
    private String subjectCode;

    @NotNull(message = "student_id không được để trống.")
    private UUID studentId;

    @NotBlank(message = "Lý do không được để trống.")
    private String reason;

    @NotBlank(message = "Học kỳ không được để trống.")
    private String semester;

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}
