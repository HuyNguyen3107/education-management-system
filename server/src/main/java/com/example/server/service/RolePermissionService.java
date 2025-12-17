package com.example.server.service;

import com.example.server.dto.CreateRolePermissionDto;
import com.example.server.dto.RolePermissionResponseDto;
import com.example.server.dto.UpdateRolePermissionDto;
import com.example.server.entity.RolePermission;
import com.example.server.repository.RolePermissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RolePermissionService {

    private final RolePermissionRepository rolePermissionRepository;

    public RolePermissionService(RolePermissionRepository rolePermissionRepository) {
        this.rolePermissionRepository = rolePermissionRepository;
    }

    public List<RolePermissionResponseDto> getAllRolePermissions() {
        return rolePermissionRepository.findAll().stream()
                .map(RolePermissionResponseDto::new)
                .collect(Collectors.toList());
    }

    public RolePermissionResponseDto getRolePermissionById(UUID id) {
        RolePermission rolePermission = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền vai trò với ID: " + id));
        return new RolePermissionResponseDto(rolePermission);
    }

    public List<RolePermissionResponseDto> getRolePermissionsByRoleId(UUID roleId) {
        return rolePermissionRepository.findByRoleId(roleId).stream()
                .map(RolePermissionResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<RolePermissionResponseDto> getRolePermissionsByPermissionId(UUID permissionId) {
        return rolePermissionRepository.findByPermissionId(permissionId).stream()
                .map(RolePermissionResponseDto::new)
                .collect(Collectors.toList());
    }

    public RolePermissionResponseDto createRolePermission(CreateRolePermissionDto createRolePermissionDto) {
        // Check if this role-permission combination already exists
        if (rolePermissionRepository.findByRoleIdAndPermissionId(
                createRolePermissionDto.getRoleId(), 
                createRolePermissionDto.getPermissionId()).isPresent()) {
            throw new RuntimeException("Vai trò này đã được gán quyền này");
        }

        RolePermission rolePermission = new RolePermission();
        rolePermission.setRoleId(createRolePermissionDto.getRoleId());
        rolePermission.setPermissionId(createRolePermissionDto.getPermissionId());

        RolePermission savedRolePermission = rolePermissionRepository.save(rolePermission);
        return new RolePermissionResponseDto(savedRolePermission);
    }

    public RolePermissionResponseDto updateRolePermission(UUID id, UpdateRolePermissionDto updateRolePermissionDto) {
        RolePermission rolePermission = rolePermissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền vai trò với ID: " + id));

        if (updateRolePermissionDto.getRoleId() != null) {
            rolePermission.setRoleId(updateRolePermissionDto.getRoleId());
        }

        if (updateRolePermissionDto.getPermissionId() != null) {
            // Check if the new combination already exists (excluding current record)
            if (updateRolePermissionDto.getRoleId() != null || updateRolePermissionDto.getPermissionId() != null) {
                UUID checkRoleId = updateRolePermissionDto.getRoleId() != null ? updateRolePermissionDto.getRoleId() : rolePermission.getRoleId();
                UUID checkPermissionId = updateRolePermissionDto.getPermissionId() != null ? updateRolePermissionDto.getPermissionId() : rolePermission.getPermissionId();
                
                rolePermissionRepository.findByRoleIdAndPermissionId(checkRoleId, checkPermissionId).ifPresent(existingRolePermission -> {
                    if (!existingRolePermission.getId().equals(id)) {
                        throw new RuntimeException("Vai trò này đã được gán quyền này");
                    }
                });
            }
            rolePermission.setPermissionId(updateRolePermissionDto.getPermissionId());
        }

        RolePermission updatedRolePermission = rolePermissionRepository.save(rolePermission);
        return new RolePermissionResponseDto(updatedRolePermission);
    }

    public void deleteRolePermission(UUID id) {
        if (!rolePermissionRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phân quyền vai trò với ID: " + id);
        }
        rolePermissionRepository.deleteById(id);
    }
}
