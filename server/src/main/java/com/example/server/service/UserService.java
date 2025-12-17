package com.example.server.service;

import com.example.server.dto.CreateUserDto;
import com.example.server.dto.UpdateUserDto;
import com.example.server.dto.UserResponseDto;
import com.example.server.entity.User;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<UserResponseDto> getUsers(Specification<User> spec, Pageable pageable) {
        return userRepository.findAll(spec, pageable).map(UserResponseDto::new);
    }

    public UserResponseDto createUser(CreateUserDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại trong hệ thống");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setAddress(dto.getAddress());
        user.setStatus(dto.getStatus() != null ? dto.getStatus() : "Active");
        user.setAcademicYear(dto.getAcademicYear());
        user.setEducationLevel(dto.getEducationLevel());

        return new UserResponseDto(userRepository.save(user));
    }

    public UserResponseDto updateUser(UUID id, UpdateUserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));

        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
             if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại trong hệ thống");
            }
            user.setEmail(dto.getEmail());
        }
        
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getFullName() != null) user.setName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getGender() != null) user.setGender(dto.getGender());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getStatus() != null) user.setStatus(dto.getStatus());
        if (dto.getAcademicYear() != null) user.setAcademicYear(dto.getAcademicYear());
        if (dto.getEducationLevel() != null) user.setEducationLevel(dto.getEducationLevel());

        return new UserResponseDto(userRepository.save(user));
    }

    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng");
        }
        userRepository.deleteById(id);
    }
    
    public UserResponseDto changeStatus(UUID id, String status) {
         User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng"));
         user.setStatus(status);
         return new UserResponseDto(userRepository.save(user));
    }
}
