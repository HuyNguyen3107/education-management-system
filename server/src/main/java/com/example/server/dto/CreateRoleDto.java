package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateRoleDto {

    @NotBlank(message = "Tên role không được để trống")
    @Size(max = 50, message = "Tên role không được vượt quá 50 ký tự")
    private String name;

    // Constructors
    public CreateRoleDto() {
    }

    public CreateRoleDto(String name) {
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
