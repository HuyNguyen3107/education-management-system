package com.example.server.controller;

import com.example.server.dto.CreditClassResponseDto;
import com.example.server.dto.CreateStudentCreditClassDto;
import com.example.server.dto.StudentCreditClassResponseDto;
import com.example.server.dto.UpdateStudentCreditClassDto;
import com.example.server.service.StudentCreditClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/student-credit-classes")
public class StudentCreditClassController {

    private final StudentCreditClassService studentCreditClassService;

    public StudentCreditClassController(StudentCreditClassService studentCreditClassService) {
        this.studentCreditClassService = studentCreditClassService;
    }

    @GetMapping("/exam-schedule/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentExamSchedule(@PathVariable UUID studentId) {
        return ResponseEntity.ok(studentCreditClassService.getStudentExamSchedule(studentId));
    }

    @GetMapping("/grades/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getStudentGrades(@PathVariable UUID studentId) {
        return ResponseEntity.ok(studentCreditClassService.getStudentGrades(studentId));
    }

    @GetMapping("/registration-info/{studentId}")
    public ResponseEntity<List<CreditClassResponseDto>> getAvailableClassesForRegistration(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(studentCreditClassService.getAvailableClassesForRegistration(studentId));
    }

    @GetMapping("/schedule/{studentId}")
    public ResponseEntity<List<CreditClassResponseDto>> getStudentSchedule(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(studentCreditClassService.getStudentSchedule(studentId));
    }

    @GetMapping
    public ResponseEntity<List<StudentCreditClassResponseDto>> getAllStudentCreditClasses() {
        return ResponseEntity.ok(studentCreditClassService.getAllStudentCreditClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentCreditClassResponseDto> getStudentCreditClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(studentCreditClassService.getStudentCreditClassById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentCreditClassResponseDto>> getStudentCreditClassesByStudentId(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(studentCreditClassService.getStudentCreditClassesByStudentId(studentId));
    }

    @GetMapping("/credit-class/{creditClassId}")
    public ResponseEntity<List<StudentCreditClassResponseDto>> getStudentCreditClassesByCreditClassId(
            @PathVariable UUID creditClassId) {
        return ResponseEntity.ok(studentCreditClassService.getStudentCreditClassesByCreditClassId(creditClassId));
    }

    @PostMapping
    public ResponseEntity<StudentCreditClassResponseDto> createStudentCreditClass(
            @Valid @RequestBody CreateStudentCreditClassDto createStudentCreditClassDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentCreditClassService.createStudentCreditClass(createStudentCreditClassDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentCreditClassResponseDto> updateStudentCreditClass(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStudentCreditClassDto updateStudentCreditClassDto) {
        return ResponseEntity.ok(studentCreditClassService.updateStudentCreditClass(id, updateStudentCreditClassDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentCreditClass(@PathVariable UUID id) {
        studentCreditClassService.deleteStudentCreditClass(id);
        return ResponseEntity.noContent().build();
    }
}
