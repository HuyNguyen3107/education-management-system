package com.example.server.dto;

import java.util.UUID;

public class UpdateRolePermissionDto {

    private UUID roleId;
    private UUID permissionId;

    // Constructors
    public UpdateRolePermissionDto() {
    }

    public UpdateRolePermissionDto(UUID roleId, UUID permissionId) {
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
