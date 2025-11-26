package com.example.server.controller;

import com.example.server.dto.PermissionRequestDto;
import com.example.server.dto.PermissionResponseDto;
import com.example.server.service.PermissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public List<PermissionResponseDto> getAll() {
        return permissionService.getAll();
    }

    @GetMapping("/{id}")
    public PermissionResponseDto getById(@PathVariable UUID id) {
        return permissionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PermissionResponseDto create(@Valid @RequestBody PermissionRequestDto request) {
        return permissionService.create(request);
    }

    @PutMapping("/{id}")
    public PermissionResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody PermissionRequestDto request) {
        return permissionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        permissionService.delete(id);
    }
}
