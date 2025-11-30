package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePrerequisiteSubjectDto {

    @NotBlank(message = "Mã môn đăng ký không được để trống")
    @Size(max = 200, message = "Mã môn đăng ký không được quá 200 ký tự")
    private String registerCode;

    @NotBlank(message = "Mã môn tiên quyết không được để trống")
    @Size(max = 200, message = "Mã môn tiên quyết không được quá 200 ký tự")
    private String prerequisiteCode;

    // Constructors
    public CreatePrerequisiteSubjectDto() {
    }

    public CreatePrerequisiteSubjectDto(String registerCode, String prerequisiteCode) {
        this.registerCode = registerCode;
        this.prerequisiteCode = prerequisiteCode;
    }

    // Getters & Setters
    public String getRegisterCode() {
        return registerCode;
    }

    public void setRegisterCode(String registerCode) {
        this.registerCode = registerCode;
    }

    public String getPrerequisiteCode() {
        return prerequisiteCode;
    }

    public void setPrerequisiteCode(String prerequisiteCode) {
        this.prerequisiteCode = prerequisiteCode;
    }
}
