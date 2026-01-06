package com.example.server.controller;

import com.example.server.dto.TuitionCalculationResponseDto;
import com.example.server.service.TuitionCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tuition-calculation")
public class TuitionCalculationController {

    private final TuitionCalculationService tuitionCalculationService;

    public TuitionCalculationController(TuitionCalculationService tuitionCalculationService) {
        this.tuitionCalculationService = tuitionCalculationService;
    }

    /**
     * Calculate tuition for a specific student based on their current progress
     * and registered credit classes
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<TuitionCalculationResponseDto>> calculateStudentTuition(
            @PathVariable UUID studentId) {
        List<TuitionCalculationResponseDto> result = tuitionCalculationService.calculateStudentTuition(studentId);
        return ResponseEntity.ok(result);
    }
}
