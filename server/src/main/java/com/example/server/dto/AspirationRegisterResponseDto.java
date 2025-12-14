package com.example.server.dto;

import com.example.server.entity.AspirationRegister;
import java.time.OffsetDateTime;
import java.util.UUID;

public class AspirationRegisterResponseDto {

    private UUID id;
    private String subjectCode;
    private UUID studentId;
    private String reason;
    private String semester;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public AspirationRegisterResponseDto() {
    }

    public AspirationRegisterResponseDto(AspirationRegister entity) {
        this.id = entity.getId();
        this.subjectCode = entity.getSubjectCode();
        this.studentId = entity.getStudentId();
        this.reason = entity.getReason();
        this.semester = entity.getSemester();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
