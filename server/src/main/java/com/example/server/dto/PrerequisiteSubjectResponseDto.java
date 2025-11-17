package com.example.server.dto;

import com.example.server.entity.PrerequisiteSubject;

import java.time.LocalDateTime;
import java.util.UUID;

public class PrerequisiteSubjectResponseDto {

    private UUID id;
    private String registerCode;
    private String prerequisiteCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor từ PrerequisiteSubject entity
    public PrerequisiteSubjectResponseDto(PrerequisiteSubject prerequisiteSubject) {
        this.id = prerequisiteSubject.getId();
        this.registerCode = prerequisiteSubject.getRegisterCode();
        this.prerequisiteCode = prerequisiteSubject.getPrerequisiteCode();
        this.createdAt = prerequisiteSubject.getCreatedAt();
        this.updatedAt = prerequisiteSubject.getUpdatedAt();
    }

    // Getters & Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRegisterCode() {
        return registerCode;
    }

    public void setRegisterCode(String registerCode) {
        this.registerCode = registerCode;
    }

    public String getPrerequisiteCode() {
        return prerequisiteCode;
    }

    public void setPrerequisiteCode(String prerequisiteCode) {
        this.prerequisiteCode = prerequisiteCode;
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
