package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class PermissionRequestDto {

    @NotBlank(message = "Tên quyền không được để trống.")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
