package com.example.server.controller;

import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        // Chuyển đổi từ User entity sang UserResponseDto (loại bỏ password)
        return users.stream()
                   .map(UserResponseDto::new)
                   .collect(Collectors.toList());
    }
}