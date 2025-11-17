package com.example.server.dto;

import com.example.server.entity.TimeRegister;

import java.time.LocalDateTime;
import java.util.UUID;

public class TimeRegisterResponseDto {

    private UUID id;
    private String typeSemester;
    private String typeRegister;
    private String openTime;
    private String endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public TimeRegisterResponseDto() {
    }

    public TimeRegisterResponseDto(TimeRegister timeRegister) {
        this.id = timeRegister.getId();
        this.typeSemester = timeRegister.getTypeSemester();
        this.typeRegister = timeRegister.getTypeRegister();
        this.openTime = timeRegister.getOpenTime();
        this.endTime = timeRegister.getEndTime();
        this.createdAt = timeRegister.getCreatedAt();
        this.updatedAt = timeRegister.getUpdatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTypeSemester() {
        return typeSemester;
    }

    public void setTypeSemester(String typeSemester) {
        this.typeSemester = typeSemester;
    }

    public String getTypeRegister() {
        return typeRegister;
    }

    public void setTypeRegister(String typeRegister) {
        this.typeRegister = typeRegister;
    }

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
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
