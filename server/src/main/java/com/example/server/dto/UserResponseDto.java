package com.example.server.dto;

import com.example.server.entity.User;
import java.util.UUID;

/**
 * DTO để trả về thông tin user (không bao gồm password)
 */
public class UserResponseDto {
    private UUID id;
    private String email;
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String phone;
    private String address;
    private String educationLevel;
    private String academicYear;
    private String status;

    // Constructor nhận User entity
    public UserResponseDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getName(); // User entity có field là 'name'
        this.dateOfBirth = user.getDateOfBirth();
        this.gender = user.getGender();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.educationLevel = user.getEducationLevel();
        this.academicYear = user.getAcademicYear();
        this.status = user.getStatus();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(String educationLevel) {
        this.educationLevel = educationLevel;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
