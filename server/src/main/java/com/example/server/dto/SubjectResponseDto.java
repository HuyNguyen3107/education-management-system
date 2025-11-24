package com.example.server.dto;

import com.example.server.entity.Subject;
import com.fasterxml.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.util.UUID;

public class SubjectResponseDto {

    private UUID id;
    private String name;
    private String subjectCode;
    private UUID majorId;
    private UUID specializationId;
    private Float numberOfCredit;
    private JsonNode ingredientSecretion;
    private String semester;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public SubjectResponseDto() {
    }

    public SubjectResponseDto(Subject subject) {
        this.id = subject.getId();
        this.name = subject.getName();
        this.subjectCode = subject.getSubjectCode();
        this.majorId = subject.getMajorId();
        this.specializationId = subject.getSpecializationId();
        this.numberOfCredit = subject.getNumberOfCredit();
        this.ingredientSecretion = subject.getIngredientSecretion();
        this.semester = subject.getSemester();
        this.createdAt = subject.getCreatedAt();
        this.updatedAt = subject.getUpdatedAt();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
