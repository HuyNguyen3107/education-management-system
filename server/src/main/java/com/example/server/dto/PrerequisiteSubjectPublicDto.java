package com.example.server.dto;

import java.util.UUID;

public class PrerequisiteSubjectPublicDto {

    private UUID id;
    private String registerCode;
    private String registerName;
    private String prerequisiteCode;
    private String prerequisiteName;
    private String majorName;
    private String trainingSystem;

    public PrerequisiteSubjectPublicDto(UUID id, String registerCode, String registerName, String prerequisiteCode,
            String prerequisiteName, String majorName) {
        this.id = id;
        this.registerCode = registerCode;
        this.registerName = registerName;
        this.prerequisiteCode = prerequisiteCode;
        this.prerequisiteName = prerequisiteName;
        this.majorName = majorName;
        this.trainingSystem = "Đại học chính quy"; // Default or fetched if available
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRegisterCode() {
        return registerCode;
    }

    public void setRegisterCode(String registerCode) {
        this.registerCode = registerCode;
    }

    public String getRegisterName() {
        return registerName;
    }

    public void setRegisterName(String registerName) {
        this.registerName = registerName;
    }

    public String getPrerequisiteCode() {
        return prerequisiteCode;
    }

    public void setPrerequisiteCode(String prerequisiteCode) {
        this.prerequisiteCode = prerequisiteCode;
    }

    public String getPrerequisiteName() {
        return prerequisiteName;
    }

    public void setPrerequisiteName(String prerequisiteName) {
        this.prerequisiteName = prerequisiteName;
    }

    public String getMajorName() {
        return majorName;
    }

    public void setMajorName(String majorName) {
        this.majorName = majorName;
    }

    public String getTrainingSystem() {
        return trainingSystem;
    }

    public void setTrainingSystem(String trainingSystem) {
        this.trainingSystem = trainingSystem;
    }
}
