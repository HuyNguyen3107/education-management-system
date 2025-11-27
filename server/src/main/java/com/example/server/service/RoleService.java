package com.example.server.service;

import com.example.server.dto.CreateRoleDto;
import com.example.server.dto.RoleResponseDto;
import com.example.server.dto.UpdateRoleDto;
import com.example.server.entity.Role;
import com.example.server.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    /**
     * Lấy tất cả roles
     */
    public List<RoleResponseDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy role theo ID
     */
    public RoleResponseDto getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role với ID: " + id));
        return new RoleResponseDto(role);
    }

    /**
     * Lấy role theo tên
     */
    public RoleResponseDto getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role với tên: " + name));
        return new RoleResponseDto(role);
    }

    /**
     * Tạo role mới
     */
    public RoleResponseDto createRole(CreateRoleDto dto) {
        // Kiểm tra tên role đã tồn tại chưa
        if (roleRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("Tên role đã tồn tại: " + dto.getName());
        }

        Role role = new Role();
        role.setName(dto.getName());

        Role saved = roleRepository.save(role);
        return new RoleResponseDto(saved);
    }

    /**
     * Cập nhật role
     */
    public RoleResponseDto updateRole(UUID id, UpdateRoleDto dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role với ID: " + id));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            // Kiểm tra tên role mới có trùng với role khác không
            roleRepository.findByName(dto.getName()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new RuntimeException("Tên role đã tồn tại: " + dto.getName());
                }
            });
            role.setName(dto.getName());
        }

        Role updated = roleRepository.save(role);
        return new RoleResponseDto(updated);
    }

    /**
     * Xóa role
     */
    public void deleteRole(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy role với ID: " + id);
        }
        roleRepository.deleteById(id);
    }
}
