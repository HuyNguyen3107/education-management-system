package com.example.server.dto;

import com.example.server.entity.Classes;

import java.time.LocalDateTime;
import java.util.UUID;

public class ClassesResponseDto {

    private UUID id;
    private String classCode;
    private UUID teacherId;
    private UUID majorId;
    private UUID specializationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ClassesResponseDto() {
    }

    public ClassesResponseDto(Classes classes) {
        this.id = classes.getId();
        this.classCode = classes.getClassCode();
        this.teacherId = classes.getTeacherId();
        this.majorId = classes.getMajorId();
        this.specializationId = classes.getSpecializationId();
        this.createdAt = classes.getCreatedAt();
        this.updatedAt = classes.getUpdatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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
