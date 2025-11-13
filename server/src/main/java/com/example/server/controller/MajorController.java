package com.example.server.controller;

import com.example.server.dto.MajorRequestDto;
import com.example.server.dto.MajorResponseDto;
import com.example.server.service.MajorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/majors")
@CrossOrigin(origins = "*")
public class MajorController {

    private final MajorService majorService;

    public MajorController(MajorService majorService) {
        this.majorService = majorService;
    }

    // POST /api/majors
    @PostMapping
    public ResponseEntity<MajorResponseDto> create(@Valid @RequestBody MajorRequestDto req) {
        return ResponseEntity.ok(majorService.create(req));
    }

    // GET /api/majors
    @GetMapping
    public ResponseEntity<List<MajorResponseDto>> getAll() {
        return ResponseEntity.ok(majorService.getAll());
    }

    // GET /api/majors/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MajorResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(majorService.getById(id));
    }

    // PUT /api/majors/{id}
    @PutMapping("/{id}")
    public ResponseEntity<MajorResponseDto> update(@PathVariable UUID id,
            @Valid @RequestBody MajorRequestDto req) {
        return ResponseEntity.ok(majorService.update(id, req));
    }

    // DELETE /api/majors/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        majorService.delete(id);
        return ResponseEntity.ok("Major deleted successfully");
    }
}
