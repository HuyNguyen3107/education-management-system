package com.example.server.service;

import com.example.server.dto.CreateUserRoleDto;
import com.example.server.dto.UpdateUserRoleDto;
import com.example.server.dto.UserRoleResponseDto;
import com.example.server.entity.UserRole;
import com.example.server.repository.UserRoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    public List<UserRoleResponseDto> getAllUserRoles() {
        return userRoleRepository.findAll().stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public UserRoleResponseDto getUserRoleById(UUID id) {
        UserRole userRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id));
        return new UserRoleResponseDto(userRole);
    }

    public List<UserRoleResponseDto> getUserRolesByUserId(UUID userId) {
        return userRoleRepository.findByUserId(userId).stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<UserRoleResponseDto> getUserRolesByRoleId(UUID roleId) {
        return userRoleRepository.findByRoleId(roleId).stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public UserRoleResponseDto createUserRole(CreateUserRoleDto createUserRoleDto) {
        // Check if this user-role combination already exists
        if (userRoleRepository.findByUserIdAndRoleId(createUserRoleDto.getUserId(), createUserRoleDto.getRoleId()).isPresent()) {
            throw new RuntimeException("Người dùng này đã được gán vai trò này");
        }

        UserRole userRole = new UserRole();
        userRole.setUserId(createUserRoleDto.getUserId());
        userRole.setRoleId(createUserRoleDto.getRoleId());

        UserRole savedUserRole = userRoleRepository.save(userRole);
        return new UserRoleResponseDto(savedUserRole);
    }

    public UserRoleResponseDto updateUserRole(UUID id, UpdateUserRoleDto updateUserRoleDto) {
        UserRole userRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id));

        if (updateUserRoleDto.getUserId() != null) {
            userRole.setUserId(updateUserRoleDto.getUserId());
        }

        if (updateUserRoleDto.getRoleId() != null) {
            // Check if the new combination already exists (excluding current record)
            if (updateUserRoleDto.getUserId() != null || updateUserRoleDto.getRoleId() != null) {
                UUID checkUserId = updateUserRoleDto.getUserId() != null ? updateUserRoleDto.getUserId() : userRole.getUserId();
                UUID checkRoleId = updateUserRoleDto.getRoleId() != null ? updateUserRoleDto.getRoleId() : userRole.getRoleId();
                
                userRoleRepository.findByUserIdAndRoleId(checkUserId, checkRoleId).ifPresent(existingUserRole -> {
                    if (!existingUserRole.getId().equals(id)) {
                        throw new RuntimeException("Người dùng này đã được gán vai trò này");
                    }
                });
            }
            userRole.setRoleId(updateUserRoleDto.getRoleId());
        }

        UserRole updatedUserRole = userRoleRepository.save(userRole);
        return new UserRoleResponseDto(updatedUserRole);
    }

    public void deleteUserRole(UUID id) {
        if (!userRoleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id);
        }
        userRoleRepository.deleteById(id);
    }
}
