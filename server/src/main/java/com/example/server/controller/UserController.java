package com.example.server.controller;

import com.example.server.dto.UserResponseDto;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Lấy danh sách tất cả users (không bao gồm password)
     * Endpoint này yêu cầu authentication
     */
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        logger.info("Lấy danh sách tất cả users");
        List<User> users = userRepository.findAll();
        
        // Chuyển đổi từ User entity sang UserResponseDto (loại bỏ password)
        return users.stream()
                   .map(UserResponseDto::new)
                   .collect(Collectors.toList());
    }
}
