package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TuitionRequestDto {

    @NotNull(message = "Học phí không được để trống.")
    private Double price;

    @NotBlank(message = "Học kỳ không được để trống.")
    private String semester;

    @NotBlank(message = "Năm không được để trống.")
    private String year;

    @NotBlank(message = "Niên khóa không được để trống.")
    private String academicYear;

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}
