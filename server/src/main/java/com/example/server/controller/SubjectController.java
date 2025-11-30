package com.example.server.controller;

import com.example.server.dto.CreateSubjectDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.dto.UpdateSubjectDto;
import com.example.server.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    /**
     * Lấy tất cả môn học
     */
    @GetMapping
    public ResponseEntity<List<SubjectResponseDto>> getAllSubjects() {
        List<SubjectResponseDto> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    /**
     * Lấy môn học theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDto> getSubjectById(@PathVariable UUID id) {
        SubjectResponseDto subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(subject);
    }

    /**
     * Lấy môn học theo mã môn học
     */
    @GetMapping("/code/{subjectCode}")
    public ResponseEntity<SubjectResponseDto> getSubjectByCode(@PathVariable String subjectCode) {
        SubjectResponseDto subject = subjectService.getSubjectByCode(subjectCode);
        return ResponseEntity.ok(subject);
    }

    /**
     * Tạo môn học mới
     */
    @PostMapping
    public ResponseEntity<SubjectResponseDto> createSubject(
            @Valid @RequestBody CreateSubjectDto dto) {
        SubjectResponseDto created = subjectService.createSubject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cập nhật môn học
     */
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDto> updateSubject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSubjectDto dto) {
        SubjectResponseDto updated = subjectService.updateSubject(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa môn học
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy môn học theo major_id
     */
    @GetMapping("/major/{majorId}")
    public ResponseEntity<List<SubjectResponseDto>> getSubjectsByMajorId(
            @PathVariable UUID majorId) {
        List<SubjectResponseDto> subjects = subjectService.getSubjectsByMajorId(majorId);
        return ResponseEntity.ok(subjects);
    }

    /**
     * Lấy môn học theo specialization_id
     */
    @GetMapping("/specialization/{specializationId}")
    public ResponseEntity<List<SubjectResponseDto>> getSubjectsBySpecializationId(
            @PathVariable UUID specializationId) {
        List<SubjectResponseDto> subjects = subjectService.getSubjectsBySpecializationId(specializationId);
        return ResponseEntity.ok(subjects);
    }

    /**
     * Lấy môn học theo học kỳ
     */
    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<SubjectResponseDto>> getSubjectsBySemester(
            @PathVariable String semester) {
        List<SubjectResponseDto> subjects = subjectService.getSubjectsBySemester(semester);
        return ResponseEntity.ok(subjects);
    }

    /**
     * Lấy môn học theo major_id và semester
     */
    @GetMapping("/search")
    public ResponseEntity<List<SubjectResponseDto>> getSubjectsByMajorIdAndSemester(
            @RequestParam UUID majorId,
            @RequestParam String semester) {
        List<SubjectResponseDto> subjects = subjectService.getSubjectsByMajorIdAndSemester(majorId, semester);
        return ResponseEntity.ok(subjects);
    }
}
