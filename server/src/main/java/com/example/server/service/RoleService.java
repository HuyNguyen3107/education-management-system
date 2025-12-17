package com.example.server.service;

import com.example.server.dto.CreateRoleDto;
import com.example.server.dto.RoleResponseDto;
import com.example.server.dto.UpdateRoleDto;
import com.example.server.entity.Role;
import com.example.server.exception.ConflictException;
import com.example.server.exception.NotFoundException;
import com.example.server.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<RoleResponseDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(RoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public RoleResponseDto getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vai trò với ID: " + id));
        return new RoleResponseDto(role);
    }

    public RoleResponseDto getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vai trò với tên: " + name));
        return new RoleResponseDto(role);
    }

    public RoleResponseDto createRole(CreateRoleDto createRoleDto) {
        // Check if role with same name already exists
        if (roleRepository.findByName(createRoleDto.getName()).isPresent()) {
            throw new ConflictException("Vai trò với tên '" + createRoleDto.getName() + "' đã tồn tại");
        }

        Role role = new Role();
        role.setName(createRoleDto.getName());

        Role savedRole = roleRepository.save(role);
        return new RoleResponseDto(savedRole);
    }

    public RoleResponseDto updateRole(UUID id, UpdateRoleDto updateRoleDto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy vai trò với ID: " + id));

        if (updateRoleDto.getName() != null && !updateRoleDto.getName().trim().isEmpty()) {
            // Check if another role with the same name exists (excluding current role)
            roleRepository.findByName(updateRoleDto.getName()).ifPresent(existingRole -> {
                if (!existingRole.getId().equals(id)) {
                    throw new ConflictException("Vai trò với tên '" + updateRoleDto.getName() + "' đã tồn tại");
                }
            });
            role.setName(updateRoleDto.getName());
        }

        Role updatedRole = roleRepository.save(role);
        return new RoleResponseDto(updatedRole);
    }

    public void deleteRole(UUID id) {
        if (!roleRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy vai trò với ID: " + id);
        }
        roleRepository.deleteById(id);
    }
}
