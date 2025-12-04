package com.example.server.dto;

import com.example.server.entity.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserRoleResponseDto {

    private UUID id;
    private UUID userId;
    private UUID roleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public UserRoleResponseDto() {
    }

    public UserRoleResponseDto(UserRole userRole) {
        this.id = userRole.getId();
        this.userId = userRole.getUserId();
        this.roleId = userRole.getRoleId();
        this.createdAt = userRole.getCreatedAt();
        this.updatedAt = userRole.getUpdatedAt();
    }

    public UserRoleResponseDto(UUID id, UUID userId, UUID roleId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.roleId = roleId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
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
