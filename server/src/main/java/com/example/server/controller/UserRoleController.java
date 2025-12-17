package com.example.server.controller;

import com.example.server.dto.CreateUserRoleDto;
import com.example.server.dto.UpdateUserRoleDto;
import com.example.server.dto.UserRoleResponseDto;
import com.example.server.service.UserRoleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user-roles")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    @GetMapping
    public ResponseEntity<List<UserRoleResponseDto>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.getAllUserRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRoleResponseDto> getUserRoleById(@PathVariable UUID id) {
        return ResponseEntity.ok(userRoleService.getUserRoleById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserRoleResponseDto>> getUserRolesByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userRoleService.getUserRolesByUserId(userId));
    }

    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<UserRoleResponseDto>> getUserRolesByRoleId(@PathVariable UUID roleId) {
        return ResponseEntity.ok(userRoleService.getUserRolesByRoleId(roleId));
    }

    @PostMapping
    public ResponseEntity<UserRoleResponseDto> createUserRole(@Valid @RequestBody CreateUserRoleDto createUserRoleDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userRoleService.createUserRole(createUserRoleDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserRoleResponseDto> updateUserRole(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRoleDto updateUserRoleDto) {
        return ResponseEntity.ok(userRoleService.updateUserRole(id, updateUserRoleDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRole(@PathVariable UUID id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.noContent().build();
    }
}
