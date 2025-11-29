package com.example.server.dto;

import jakarta.validation.constraints.Size;

public class UpdateRoleDto {

    @Size(max = 50, message = "Name must not exceed 50 characters")
    private String name;

    // Constructors
    public UpdateRoleDto() {
    }

    public UpdateRoleDto(String name) {
        this.name = name;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
