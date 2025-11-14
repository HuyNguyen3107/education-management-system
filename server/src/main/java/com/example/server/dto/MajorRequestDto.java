package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class MajorRequestDto {

    @NotBlank(message = "Tên ngành không được để trống")
    private String name;

    // Getter & Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
