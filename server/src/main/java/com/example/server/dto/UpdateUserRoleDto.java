package com.example.server.dto;

import java.util.UUID;

public class UpdateUserRoleDto {

    private UUID userId;
    private UUID roleId;

    // Constructors
    public UpdateUserRoleDto() {
    }

    public UpdateUserRoleDto(UUID userId, UUID roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    // Getters and Setters
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
}
