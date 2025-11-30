package com.example.server.controller;

import com.example.server.dto.CreditClassRequestDto;
import com.example.server.dto.CreditClassResponseDto;
import com.example.server.service.CreditClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/credit-classes")
public class CreditClassController {

    private final CreditClassService creditClassService;

    public CreditClassController(CreditClassService creditClassService) {
        this.creditClassService = creditClassService;
    }

    @GetMapping
    public List<CreditClassResponseDto> getAll() {
        return creditClassService.getAll();
    }

    @GetMapping("/{id}")
    public CreditClassResponseDto getById(@PathVariable UUID id) {
        return creditClassService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreditClassResponseDto create(@Valid @RequestBody CreditClassRequestDto request) {
        return creditClassService.create(request);
    }

    @PutMapping("/{id}")
    public CreditClassResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody CreditClassRequestDto request) {
        return creditClassService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        creditClassService.delete(id);
    }
}
