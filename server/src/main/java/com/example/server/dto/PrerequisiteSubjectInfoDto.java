package com.example.server.dto;

import java.util.UUID;

public class PrerequisiteSubjectInfoDto {

    private UUID id;
    private String prerequisiteCode;
    private String prerequisiteName;

    public PrerequisiteSubjectInfoDto() {
    }

    public PrerequisiteSubjectInfoDto(UUID id, String prerequisiteCode, String prerequisiteName) {
        this.id = id;
        this.prerequisiteCode = prerequisiteCode;
        this.prerequisiteName = prerequisiteName;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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
}
