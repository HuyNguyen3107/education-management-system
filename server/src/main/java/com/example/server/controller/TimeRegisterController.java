package com.example.server.controller;

import com.example.server.dto.CreateTimeRegisterDto;
import com.example.server.dto.TimeRegisterResponseDto;
import com.example.server.dto.UpdateTimeRegisterDto;
import com.example.server.service.TimeRegisterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/time-registers")
public class TimeRegisterController {

    @Autowired
    private TimeRegisterService timeRegisterService;

    /**
     * Lấy tất cả thời gian đăng ký
     */
    @GetMapping
    public ResponseEntity<List<TimeRegisterResponseDto>> getAllTimeRegisters() {
        List<TimeRegisterResponseDto> timeRegisters = timeRegisterService.getAllTimeRegisters();
        return ResponseEntity.ok(timeRegisters);
    }

    /**
     * Lấy thời gian đăng ký theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TimeRegisterResponseDto> getTimeRegisterById(@PathVariable UUID id) {
        TimeRegisterResponseDto timeRegister = timeRegisterService.getTimeRegisterById(id);
        return ResponseEntity.ok(timeRegister);
    }

    /**
     * Tạo thời gian đăng ký mới
     */
    @PostMapping
    public ResponseEntity<TimeRegisterResponseDto> createTimeRegister(
            @Valid @RequestBody CreateTimeRegisterDto dto) {
        TimeRegisterResponseDto created = timeRegisterService.createTimeRegister(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Cập nhật thời gian đăng ký
     */
    @PutMapping("/{id}")
    public ResponseEntity<TimeRegisterResponseDto> updateTimeRegister(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTimeRegisterDto dto) {
        TimeRegisterResponseDto updated = timeRegisterService.updateTimeRegister(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa thời gian đăng ký
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeRegister(@PathVariable UUID id) {
        timeRegisterService.deleteTimeRegister(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lấy thời gian đăng ký theo loại học kỳ
     */
    @GetMapping("/type-semester/{typeSemester}")
    public ResponseEntity<List<TimeRegisterResponseDto>> getByTypeSemester(
            @PathVariable String typeSemester) {
        List<TimeRegisterResponseDto> timeRegisters = timeRegisterService.getByTypeSemester(typeSemester);
        return ResponseEntity.ok(timeRegisters);
    }

    /**
     * Lấy thời gian đăng ký theo loại đăng ký
     */
    @GetMapping("/type-register/{typeRegister}")
    public ResponseEntity<List<TimeRegisterResponseDto>> getByTypeRegister(
            @PathVariable String typeRegister) {
        List<TimeRegisterResponseDto> timeRegisters = timeRegisterService.getByTypeRegister(typeRegister);
        return ResponseEntity.ok(timeRegisters);
    }

    /**
     * Tìm kiếm theo cả loại học kỳ và loại đăng ký
     */
    @GetMapping("/search")
    public ResponseEntity<List<TimeRegisterResponseDto>> searchByBothTypes(
            @RequestParam String typeSemester,
            @RequestParam String typeRegister) {
        List<TimeRegisterResponseDto> results = timeRegisterService.searchByBothTypes(typeSemester, typeRegister);
        return ResponseEntity.ok(results);
    }
}
