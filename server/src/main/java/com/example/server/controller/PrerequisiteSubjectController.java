package com.example.server.controller;

import com.example.server.dto.CreatePrerequisiteSubjectDto;
import com.example.server.dto.PrerequisiteSubjectPublicDto;
import com.example.server.dto.PrerequisiteSubjectResponseDto;
import com.example.server.dto.UpdatePrerequisiteSubjectDto;
import com.example.server.service.PrerequisiteSubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prerequisite-subjects")
public class PrerequisiteSubjectController {

    @Autowired
    private PrerequisiteSubjectService prerequisiteSubjectService;

    /**
     * Lấy tất cả môn tiên quyết
     */
    @GetMapping
    public ResponseEntity<List<PrerequisiteSubjectResponseDto>> getAllPrerequisiteSubjects() {
        List<PrerequisiteSubjectResponseDto> prerequisites = prerequisiteSubjectService.getAllPrerequisiteSubjects();
        return ResponseEntity.ok(prerequisites);
    }

    /**
     * Lấy môn tiên quyết theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PrerequisiteSubjectResponseDto> getPrerequisiteSubjectById(@PathVariable UUID id) {
        PrerequisiteSubjectResponseDto prerequisite = prerequisiteSubjectService.getPrerequisiteSubjectById(id);
        return ResponseEntity.ok(prerequisite);
    }

    /**
     * Tạo môn tiên quyết mới
     */
    @PostMapping
    public ResponseEntity<PrerequisiteSubjectResponseDto> createPrerequisiteSubject(
            @Valid @RequestBody CreatePrerequisiteSubjectDto dto) {
        PrerequisiteSubjectResponseDto created = prerequisiteSubjectService.createPrerequisiteSubject(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cập nhật môn tiên quyết
     */
    @PutMapping("/{id}")
    public ResponseEntity<PrerequisiteSubjectResponseDto> updatePrerequisiteSubject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePrerequisiteSubjectDto dto) {
        PrerequisiteSubjectResponseDto updated = prerequisiteSubjectService.updatePrerequisiteSubject(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa môn tiên quyết
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrerequisiteSubject(@PathVariable UUID id) {
        prerequisiteSubjectService.deletePrerequisiteSubject(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy tất cả môn tiên quyết của một môn học
     */
    @GetMapping("/register-code/{registerCode}")
    public ResponseEntity<List<PrerequisiteSubjectResponseDto>> getPrerequisitesByRegisterCode(
            @PathVariable String registerCode) {
        List<PrerequisiteSubjectResponseDto> prerequisites = prerequisiteSubjectService
                .getPrerequisitesByRegisterCode(registerCode);
        return ResponseEntity.ok(prerequisites);
    }

    /**
     * Lấy tất cả môn học yêu cầu một môn làm tiên quyết
     */
    @GetMapping("/prerequisite-code/{prerequisiteCode}")
    public ResponseEntity<List<PrerequisiteSubjectResponseDto>> getByPrerequisiteCode(
            @PathVariable String prerequisiteCode) {
        List<PrerequisiteSubjectResponseDto> subjects = prerequisiteSubjectService
                .getByPrerequisiteCode(prerequisiteCode);
        return ResponseEntity.ok(subjects);
    }

    /**
     * Tìm kiếm theo cả 2 mã
     */
    @GetMapping("/search")
    public ResponseEntity<List<PrerequisiteSubjectResponseDto>> searchByBothCodes(
            @RequestParam String registerCode,
            @RequestParam String prerequisiteCode) {
        List<PrerequisiteSubjectResponseDto> results = prerequisiteSubjectService.searchByBothCodes(registerCode,
                prerequisiteCode);
        return ResponseEntity.ok(results);
    }

    /**
     * Lấy danh sách public (kèm tên môn), có thể lọc theo userId
     */
    @GetMapping("/public")
    public ResponseEntity<List<PrerequisiteSubjectPublicDto>> getPublicPrerequisiteSubjects(
            @RequestParam(required = false) UUID userId) {
        List<PrerequisiteSubjectPublicDto> list = prerequisiteSubjectService.getPublicPrerequisiteSubjects(userId);
        return ResponseEntity.ok(list);
    }
}
