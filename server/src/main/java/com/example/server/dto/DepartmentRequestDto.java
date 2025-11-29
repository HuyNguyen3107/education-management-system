package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class DepartmentRequestDto {

    @NotBlank(message = "Tên khoa không được để trống.")
    private String name;

    @NotNull(message = "Ngành không được để trống.")
    private UUID majorId;

    // GETTERS & SETTERS

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getMajorId() {
        return majorId;
    }

    public void setMajorId(UUID majorId) {
        this.majorId = majorId;
    }
}
