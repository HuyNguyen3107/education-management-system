package com.example.server.controller;

import com.example.server.dto.SpecializationRequestDto;
import com.example.server.dto.SpecializationResponseDto;
import com.example.server.service.SpecializationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/specializations")
public class SpecializationController {

    private final SpecializationService specializationService;

    public SpecializationController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping
    public List<SpecializationResponseDto> getAll() {
        return specializationService.getAll();
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
