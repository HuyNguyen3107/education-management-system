package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", length = 500, nullable = false)
    private String name;

    @Column(name = "subject_code", length = 200, nullable = false)
    private String subjectCode;

    @Column(name = "major_id")
    private UUID majorId;

    @Column(name = "specialization_id")
    private UUID specializationId;

    @Column(name = "number_of_credit", nullable = true)
    private Float numberOfCredit;

    @Column(name = "ingredient_secretion", columnDefinition = "json")
    private String ingredientSecretion;

    @Column(name = "semester", length = 300, nullable = false)
    private String semester;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Subject() {
    }

    public Subject(String name, String subjectCode, UUID majorId, UUID specializationId, 
                   Float numberOfCredit, String ingredientSecretion, String semester) {
        this.name = name;
        this.subjectCode = subjectCode;
        this.majorId = majorId;
        this.specializationId = specializationId;
        this.numberOfCredit = numberOfCredit;
        this.ingredientSecretion = ingredientSecretion;
        this.semester = semester;
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

    public String getIngredientSecretion() {
        return ingredientSecretion;
    }

    public void setIngredientSecretion(String ingredientSecretion) {
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
