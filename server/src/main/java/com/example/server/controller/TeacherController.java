package com.example.server.controller;

import com.example.server.dto.TeacherRequestDto;
import com.example.server.dto.TeacherResponseDto;
import com.example.server.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<TeacherResponseDto> getAll() {
        return teacherService.getAll();
    }

    @GetMapping("/{id}")
    public TeacherResponseDto getById(@PathVariable UUID id) {
        return teacherService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeacherResponseDto create(@Valid @RequestBody TeacherRequestDto request) {
        return teacherService.create(request);
    }

    @PutMapping("/{id}")
    public TeacherResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody TeacherRequestDto request) {
        return teacherService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        teacherService.delete(id);
    }
}
