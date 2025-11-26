package com.example.server.service;

import com.example.server.dto.PermissionRequestDto;
import com.example.server.dto.PermissionResponseDto;
import com.example.server.entity.Permission;
import com.example.server.repository.PermissionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public List<PermissionResponseDto> getAll() {
        return permissionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PermissionResponseDto getById(UUID id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy quyền với id: " + id));

        return toResponse(permission);
    }

    public PermissionResponseDto create(PermissionRequestDto request) {

        if (permissionRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên quyền đã tồn tại.");
        }

        Permission permission = new Permission();
        permission.setName(request.getName().trim());

        return toResponse(permissionRepository.save(permission));
    }

    public PermissionResponseDto update(UUID id, PermissionRequestDto request) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy quyền với id: " + id));

        if (permissionRepository.existsByNameIgnoreCase(request.getName().trim())
                && !permission.getName().equalsIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên quyền đã tồn tại.");
        }

        permission.setName(request.getName().trim());

        return toResponse(permissionRepository.save(permission));
    }

    public void delete(UUID id) {
        if (!permissionRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy quyền với id: " + id);
        }

        permissionRepository.deleteById(id);
    }

    private PermissionResponseDto toResponse(Permission permission) {
        PermissionResponseDto res = new PermissionResponseDto();
        res.setId(permission.getId());
        res.setName(permission.getName());
        res.setCreatedAt(permission.getCreatedAt());
        res.setUpdatedAt(permission.getUpdatedAt());
        return res;
    }
}
