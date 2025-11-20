package com.example.server.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "time_registers")
public class TimeRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "type_semester", length = 100, nullable = true)
    private String typeSemester;

    @Column(name = "type_register", length = 100, nullable = true)
    private String typeRegister;

    @Column(name = "open_time", length = 100, nullable = true)
    private String openTime;

    @Column(name = "end_time", length = 100, nullable = true)
    private String endTime;

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
    public TimeRegister() {
    }

    public TimeRegister(String typeSemester, String typeRegister, String openTime, String endTime) {
        this.typeSemester = typeSemester;
        this.typeRegister = typeRegister;
        this.openTime = openTime;
        this.endTime = endTime;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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
