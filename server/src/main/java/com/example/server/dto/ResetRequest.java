package com.example.server.dto; // Đảm bảo package khớp

public class ResetRequest {
    private String email;

    // Getter
    public String getEmail() {
        return email;
    }

    // Setter
    public void setEmail(String email) {
        this.email = email;
    }
}