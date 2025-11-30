package com.example.server.controller;

import com.example.server.dto.ClassesResponseDto;
import com.example.server.dto.CreateClassesDto;
import com.example.server.dto.UpdateClassesDto;
import com.example.server.service.ClassesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/classes")
public class ClassesController {

    @Autowired
    private ClassesService classesService;

    /**
     * Lấy tất cả lớp học
     */
    @GetMapping
    public ResponseEntity<List<ClassesResponseDto>> getAllClasses() {
        List<ClassesResponseDto> classes = classesService.getAllClasses();
        return ResponseEntity.ok(classes);
    }

    /**
     * Lấy lớp học theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClassesResponseDto> getClassesById(@PathVariable UUID id) {
        ClassesResponseDto classes = classesService.getClassesById(id);
        return ResponseEntity.ok(classes);
    }

    /**
     * Lấy lớp học theo mã lớp
     */
    @GetMapping("/code/{classCode}")
    public ResponseEntity<ClassesResponseDto> getClassesByCode(@PathVariable String classCode) {
        ClassesResponseDto classes = classesService.getClassesByCode(classCode);
        return ResponseEntity.ok(classes);
    }

    /**
     * Tạo lớp học mới
     */
    @PostMapping
    public ResponseEntity<ClassesResponseDto> createClasses(
            @Valid @RequestBody CreateClassesDto dto) {
        ClassesResponseDto created = classesService.createClasses(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cập nhật lớp học
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClassesResponseDto> updateClasses(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateClassesDto dto) {
        ClassesResponseDto updated = classesService.updateClasses(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa lớp học
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasses(@PathVariable UUID id) {
        classesService.deleteClasses(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy lớp học theo teacher_id
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<ClassesResponseDto>> getClassesByTeacherId(
            @PathVariable UUID teacherId) {
        List<ClassesResponseDto> classes = classesService.getClassesByTeacherId(teacherId);
        return ResponseEntity.ok(classes);
    }

    /**
     * Lấy lớp học theo major_id
     */
    @GetMapping("/major/{majorId}")
    public ResponseEntity<List<ClassesResponseDto>> getClassesByMajorId(
            @PathVariable UUID majorId) {
        List<ClassesResponseDto> classes = classesService.getClassesByMajorId(majorId);
        return ResponseEntity.ok(classes);
    }

    /**
     * Lấy lớp học theo specialization_id
     */
    @GetMapping("/specialization/{specializationId}")
    public ResponseEntity<List<ClassesResponseDto>> getClassesBySpecializationId(
            @PathVariable UUID specializationId) {
        List<ClassesResponseDto> classes = classesService.getClassesBySpecializationId(specializationId);
        return ResponseEntity.ok(classes);
    }
}
