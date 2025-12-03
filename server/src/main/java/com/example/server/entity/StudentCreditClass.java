package com.example.server.entity;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_credit_classes")
public class StudentCreditClass {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "student_id", nullable = false)
    private UUID studentId;

    @Column(name = "credit_class_id", nullable = false)
    private UUID creditClassId;

    @Column(name = "scores", columnDefinition = "jsonb")
    private JsonNode scores;

    @Column(name = "exam_schedule", columnDefinition = "jsonb")
    private JsonNode examSchedule;

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
    public StudentCreditClass() {
    }

    public StudentCreditClass(UUID studentId, UUID creditClassId, JsonNode scores, JsonNode examSchedule) {
        this.studentId = studentId;
        this.creditClassId = creditClassId;
        this.scores = scores;
        this.examSchedule = examSchedule;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getCreditClassId() {
        return creditClassId;
    }

    public void setCreditClassId(UUID creditClassId) {
        this.creditClassId = creditClassId;
    }

    public JsonNode getScores() {
        return scores;
    }

    public void setScores(JsonNode scores) {
        this.scores = scores;
    }

    public JsonNode getExamSchedule() {
        return examSchedule;
    }

    public void setExamSchedule(JsonNode examSchedule) {
        this.examSchedule = examSchedule;
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
