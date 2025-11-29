package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.UUID;

public class CreateSubjectDto {

    @NotBlank(message = "Tên môn học không được để trống")
    @Size(max = 500, message = "Tên môn học không được vượt quá 500 ký tự")
    private String name;

    @NotBlank(message = "Mã môn học không được để trống")
    @Size(max = 200, message = "Mã môn học không được vượt quá 200 ký tự")
    private String subjectCode;

    private UUID majorId;

    private UUID specializationId;

    private Float numberOfCredit;

    @NotNull(message = "Ingredient secretion không được để trống")
    private String ingredientSecretion;

    @NotBlank(message = "Học kỳ không được để trống")
    @Size(max = 300, message = "Học kỳ không được vượt quá 300 ký tự")
    private String semester;

    // Constructors
    public CreateSubjectDto() {
    }

    public CreateSubjectDto(String name, String subjectCode, UUID majorId, UUID specializationId,
                            Float numberOfCredit, JsonNode ingredientSecretion, String semester) {
        this.name = name;
        this.subjectCode = subjectCode;
        this.majorId = majorId;
        this.specializationId = specializationId;
        this.numberOfCredit = numberOfCredit;
        this.ingredientSecretion = ingredientSecretion;
        this.semester = semester;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public UUID getMajorId() {
        return majorId;
    }

    public void setMajorId(UUID majorId) {
        this.majorId = majorId;
    }

    public UUID getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(UUID specializationId) {
        this.specializationId = specializationId;
    }

    public Float getNumberOfCredit() {
        return numberOfCredit;
    }

    public void setNumberOfCredit(Float numberOfCredit) {
        this.numberOfCredit = numberOfCredit;
    }

    public JsonNode getIngredientSecretion() {
        return ingredientSecretion;
    }

    public void setIngredientSecretion(JsonNode ingredientSecretion) {
        this.ingredientSecretion = ingredientSecretion;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}
