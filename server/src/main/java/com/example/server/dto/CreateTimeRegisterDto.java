package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateTimeRegisterDto {

    @Size(max = 300, message = "Loại học kỳ không được vượt quá 300 ký tự")
    private String typeSemester;

    @Size(max = 300, message = "Loại đăng ký không được vượt quá 300 ký tự")
    private String typeRegister;

    @NotBlank(message = "Thời gian mở không được để trống")
    @Size(max = 100, message = "Thời gian mở không được vượt quá 100 ký tự")
    private String openTime;

    @NotBlank(message = "Thời gian kết thúc không được để trống")
    @Size(max = 100, message = "Thời gian kết thúc không được vượt quá 100 ký tự")
    private String endTime;

    // Constructors
    public CreateTimeRegisterDto() {
    }

    public CreateTimeRegisterDto(String typeSemester, String typeRegister, String openTime, String endTime) {
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
