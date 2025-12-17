package com.example.server.controller;

import com.example.server.dto.StudentTuitionRequestDto;
import com.example.server.dto.StudentTuitionResponseDto;
import com.example.server.service.StudentTuitionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-tuitions")
public class StudentTuitionController {

    private final StudentTuitionService studentTuitionService;

    public StudentTuitionController(StudentTuitionService studentTuitionService) {
        this.studentTuitionService = studentTuitionService;
    }

    @GetMapping("/details/{studentId}")
    public List<Map<String, Object>> getDetailsByStudent(@PathVariable UUID studentId) {
        return studentTuitionService.getStudentTuitionDetails(studentId);
    }

    @GetMapping
    public List<StudentTuitionResponseDto> getAll() {
        return studentTuitionService.getAll();
    }

    @GetMapping("/{id}")
    public StudentTuitionResponseDto getById(@PathVariable UUID id) {
        return studentTuitionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentTuitionResponseDto create(
            @Valid @RequestBody StudentTuitionRequestDto request) {
        return studentTuitionService.create(request);
    }

    @PutMapping("/{id}")
    public StudentTuitionResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody StudentTuitionRequestDto request) {
        return studentTuitionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        studentTuitionService.delete(id);
    }
}
