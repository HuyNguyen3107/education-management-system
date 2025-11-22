package com.example.server.controller;

import com.example.server.dto.TuitionRequestDto;
import com.example.server.dto.TuitionResponseDto;
import com.example.server.service.TuitionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tuitions")
public class TuitionController {

    private final TuitionService tuitionService;

    public TuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @GetMapping
    public List<TuitionResponseDto> getAll() {
        return tuitionService.getAll();
    }

    @GetMapping("/{id}")
    public TuitionResponseDto getById(@PathVariable UUID id) {
        return tuitionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TuitionResponseDto create(@Valid @RequestBody TuitionRequestDto request) {
        return tuitionService.create(request);
    }

    @PutMapping("/{id}")
    public TuitionResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody TuitionRequestDto request) {
        return tuitionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        tuitionService.delete(id);
    }
}
