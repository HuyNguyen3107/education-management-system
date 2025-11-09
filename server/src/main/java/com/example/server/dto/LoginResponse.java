package com.example.server.dto;

import com.example.server.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token; // JWT token
    private User user; // Thông tin người dùng (trừ password)
}
