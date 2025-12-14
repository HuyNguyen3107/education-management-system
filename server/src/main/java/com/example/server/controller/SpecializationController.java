package com.example.server.controller;

import com.example.server.dto.SpecializationRequestDto;
import com.example.server.dto.SpecializationResponseDto;
import com.example.server.service.SpecializationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/specializations")
@CrossOrigin(origins = "*")
public class SpecializationController {

    private final SpecializationService specializationService;

    public SpecializationController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID majorId
    ) {
        if (majorId != null) {
            return ResponseEntity.ok(specializationService.getByMajorId(majorId));
        }
        // If page is 0 and size is large, return all (for dropdowns)
        if (size >= 10000) {
            return ResponseEntity.ok(specializationService.getAll());
        }
        return ResponseEntity.ok(specializationService.getSpecializations(page, size, keyword));
    }

    @GetMapping("/{id}")
    public SpecializationResponseDto getById(@PathVariable UUID id) {
        return specializationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpecializationResponseDto create(@Valid @RequestBody SpecializationRequestDto request) {
        return specializationService.create(request);
    }

    @PutMapping("/{id}")
    public SpecializationResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody SpecializationRequestDto request) {
        return specializationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        specializationService.delete(id);
    }
}
