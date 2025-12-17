package com.example.server.controller;

import com.example.server.dto.CreateRolePermissionDto;
import com.example.server.dto.RolePermissionResponseDto;
import com.example.server.dto.UpdateRolePermissionDto;
import com.example.server.service.RolePermissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/role-permissions")
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    public RolePermissionController(RolePermissionService rolePermissionService) {
        this.rolePermissionService = rolePermissionService;
    }

    @GetMapping
    public ResponseEntity<List<RolePermissionResponseDto>> getAllRolePermissions() {
        return ResponseEntity.ok(rolePermissionService.getAllRolePermissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolePermissionResponseDto> getRolePermissionById(@PathVariable UUID id) {
        return ResponseEntity.ok(rolePermissionService.getRolePermissionById(id));
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<RolePermissionResponseDto>> getRolePermissionsByRoleId(@PathVariable UUID roleId) {
        return ResponseEntity.ok(rolePermissionService.getRolePermissionsByRoleId(roleId));
    }

    @GetMapping("/permission/{permissionId}")
    public ResponseEntity<List<RolePermissionResponseDto>> getRolePermissionsByPermissionId(@PathVariable UUID permissionId) {
        return ResponseEntity.ok(rolePermissionService.getRolePermissionsByPermissionId(permissionId));
    }

    @PostMapping
    public ResponseEntity<RolePermissionResponseDto> createRolePermission(@Valid @RequestBody CreateRolePermissionDto createRolePermissionDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rolePermissionService.createRolePermission(createRolePermissionDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolePermissionResponseDto> updateRolePermission(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRolePermissionDto updateRolePermissionDto) {
        return ResponseEntity.ok(rolePermissionService.updateRolePermission(id, updateRolePermissionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRolePermission(@PathVariable UUID id) {
        rolePermissionService.deleteRolePermission(id);
        return ResponseEntity.noContent().build();
    }
}
