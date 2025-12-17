package com.example.server.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateRolePermissionDto {

    @NotNull(message = "Role ID is required")
    private UUID roleId;

    @NotNull(message = "Permission ID is required")
    private UUID permissionId;

    // Constructors
    public CreateRolePermissionDto() {
    }

    public CreateRolePermissionDto(UUID roleId, UUID permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }

    // Getters and Setters
    public UUID getRoleId() {
        return roleId;
    }

    public void setRoleId(UUID roleId) {
        this.roleId = roleId;
    }

    public UUID getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(UUID permissionId) {
        this.permissionId = permissionId;
    }
}
