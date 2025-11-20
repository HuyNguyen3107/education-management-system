package com.example.server.dto;

import jakarta.validation.constraints.Size;

public class UpdateTimeRegisterDto {

    @Size(max = 300, message = "Loại học kỳ không được vượt quá 300 ký tự")
    private String typeSemester;

    @Size(max = 300, message = "Loại đăng ký không được vượt quá 300 ký tự")
    private String typeRegister;

    @Size(max = 100, message = "Thời gian mở không được vượt quá 100 ký tự")
    private String openTime;

    @Size(max = 100, message = "Thời gian kết thúc không được vượt quá 100 ký tự")
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
