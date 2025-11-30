package com.example.server.dto;

public class UpdatePrerequisiteSubjectDto {

    private String registerCode;
    private String prerequisiteCode;

    // Constructors
    public UpdatePrerequisiteSubjectDto() {
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
