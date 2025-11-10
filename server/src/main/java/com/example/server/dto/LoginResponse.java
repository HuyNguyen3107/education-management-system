package com.example.server.dto;

public class LoginResponse {
    private String token;
    private String message;
    private String id;
    private String email;
    private String name;
    private String phone;
    private String dateOfBirth;
    private boolean online;
    private String createdAt;
    private String updatedAt;

    public LoginResponse() {}

    public LoginResponse(String token, String message, String id, String email,
                         String name, String phone, String dateOfBirth,
                         boolean online, String createdAt, String updatedAt) {
        this.token = token;
        this.message = message;
        this.id = id;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.online = online;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
