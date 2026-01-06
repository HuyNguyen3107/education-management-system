package com.example.server.controller;

import com.example.server.dto.StudentMajorRequestDto;
import com.example.server.dto.StudentMajorResponseDto;
import com.example.server.service.StudentMajorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-majors")
public class StudentMajorController {

    private final StudentMajorService studentMajorService;

    public StudentMajorController(StudentMajorService studentMajorService) {
        this.studentMajorService = studentMajorService;
    }

    @GetMapping
    public ResponseEntity<List<StudentMajorResponseDto>> getAll() {
        return ResponseEntity.ok(studentMajorService.getAll());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentMajorResponseDto>> getByStudentId(@PathVariable UUID studentId) {
        return ResponseEntity.ok(studentMajorService.getByStudentId(studentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentMajorResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentMajorService.getById(id));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody StudentMajorRequestDto request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(studentMajorService.create(request));
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable UUID id,
            @Valid @RequestBody StudentMajorRequestDto request) {
        try {
            return ResponseEntity.ok(studentMajorService.update(id, request));
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        try {
            studentMajorService.delete(id);
            return ResponseEntity.ok("Xóa gán ngành/chuyên ngành thành công");
        } catch (org.springframework.web.server.ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}
