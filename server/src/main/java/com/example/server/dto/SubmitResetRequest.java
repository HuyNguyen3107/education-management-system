package com.example.server.dto; // Đảm bảo package khớp

public class SubmitResetRequest {
    private String token;
    private String newPassword;

    // Getters
    public String getToken() {
        return token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    // Setters
    public void setToken(String token) {
        this.token = token;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}