package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class SpecializationRequestDto {

    @NotBlank(message = "Tên chuyên ngành không được để trống.")
    private String name;

    @NotNull(message = "Ngành (major_id) không được để trống.")
    private UUID majorId;

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
