package com.example.server.controller;

import com.example.server.dto.DepartmentRequestDto;
import com.example.server.dto.DepartmentResponseDto;
import com.example.server.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public Page<DepartmentResponseDto> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID majorId
    ) {
        return departmentService.getDepartments(page, size, keyword, majorId);
    }

    @GetMapping("/{id}")
    public DepartmentResponseDto getById(@PathVariable UUID id) {
        return departmentService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartmentResponseDto create(@Valid @RequestBody DepartmentRequestDto request) {
        return departmentService.create(request);
    }

    @PutMapping("/{id}")
    public DepartmentResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody DepartmentRequestDto request) {
        return departmentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        departmentService.delete(id);
    }
}
