package com.example.server.controller;

import com.example.server.dto.CreateRoleDto;
import com.example.server.dto.RoleResponseDto;
import com.example.server.dto.UpdateRoleDto;
import com.example.server.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private RoleService roleService;

    /**
     * Lấy tất cả roles
     */
    @GetMapping
    public ResponseEntity<List<RoleResponseDto>> getAllRoles() {
        List<RoleResponseDto> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    /**
     * Lấy role theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponseDto> getRoleById(@PathVariable UUID id) {
        RoleResponseDto role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    /**
     * Lấy role theo tên
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<RoleResponseDto> getRoleByName(@PathVariable String name) {
        RoleResponseDto role = roleService.getRoleByName(name);
        return ResponseEntity.ok(role);
    }

    /**
     * Tạo role mới
     */
    @PostMapping
    public ResponseEntity<RoleResponseDto> createRole(
            @Valid @RequestBody CreateRoleDto dto) {
        RoleResponseDto created = roleService.createRole(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cập nhật role
     */
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponseDto> updateRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoleDto dto) {
        RoleResponseDto updated = roleService.updateRole(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa role
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
