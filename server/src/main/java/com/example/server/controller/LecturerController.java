package com.example.server.controller;

import com.example.server.dto.CreditClassResponseDto;
import com.example.server.dto.LecturerProfileDto;
import com.example.server.dto.LecturerStudentResponseDto;
import com.example.server.dto.UpdateGradeRequestDto;
import com.example.server.service.LecturerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lecturer")
public class LecturerController {

    private final LecturerService lecturerService;

    public LecturerController(LecturerService lecturerService) {
        this.lecturerService = lecturerService;
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return authentication.getName(); // In this system, name is email
    }

    @GetMapping("/profile")
    public ResponseEntity<LecturerProfileDto> getProfile() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(lecturerService.getProfile(email));
    }

    @GetMapping("/classes")
    public ResponseEntity<List<CreditClassResponseDto>> getAssignedClasses() {
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(lecturerService.getAssignedClasses(email));
    }

    @GetMapping("/classes/{classId}/students")
    public ResponseEntity<List<LecturerStudentResponseDto>> getClassStudents(@PathVariable UUID classId) {
        // Optional: Check if the class actually belongs to the lecturer (Security)
        // For now, relying on Service to just fetch data.
        // A strict implementation would verify ownership here or in Service.
        return ResponseEntity.ok(lecturerService.getStudentsInClass(classId));
    }

    @PostMapping("/classes/{classId}/students/{studentId}/grade")
    public ResponseEntity<Void> updateGrade(@PathVariable UUID classId,
            @PathVariable UUID studentId,
            @RequestBody UpdateGradeRequestDto request) {
        lecturerService.updateGrade(classId, studentId, request.getScores());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/schedule")
    public ResponseEntity<List<CreditClassResponseDto>> getSchedule() {
        // Schedule is derived from assigned classes
        String email = getCurrentUserEmail();
        return ResponseEntity.ok(lecturerService.getAssignedClasses(email));
    }
}
