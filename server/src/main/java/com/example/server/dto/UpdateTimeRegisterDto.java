package com.example.server.dto;

public class UpdateTimeRegisterDto {

    private String typeSemester;
    private String typeRegister;
    private String openTime;
    private String endTime;

    // Constructors
    public UpdateTimeRegisterDto() {
    }

    public UpdateTimeRegisterDto(String typeSemester, String typeRegister, String openTime, String endTime) {
        this.typeSemester = typeSemester;
        this.typeRegister = typeRegister;
        this.openTime = openTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public String getTypeSemester() {
        return typeSemester;
    }

    public void setTypeSemester(String typeSemester) {
        this.typeSemester = typeSemester;
    }

    public String getTypeRegister() {
        return typeRegister;
    }

    public void setTypeRegister(String typeRegister) {
        this.typeRegister = typeRegister;
    }

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
