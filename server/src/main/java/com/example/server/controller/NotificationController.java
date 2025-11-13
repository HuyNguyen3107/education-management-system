package com.example.server.controller;

import com.example.server.dto.NotificationRequestDto;
import com.example.server.dto.NotificationResponseDto;
import com.example.server.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<NotificationResponseDto> create(
            @Valid @RequestBody NotificationRequestDto request) {
        return ResponseEntity.ok(service.create(request));
    }

    // ================= GET ALL FOR USER =================
    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getAll(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getAllByUser(userId));
    }

    // ================= MARK AS SEEN =================
    @PutMapping("/{id}/seen")
    public ResponseEntity<?> markAsSeen(@PathVariable UUID id) {
        service.markAsSeen(id); // ❗ KHÔNG NHẬN seenDate TỪ CLIENT
        return ResponseEntity.ok("Notification marked as seen");
    }

    // ================= UPDATE RESPONSE =================
    @PutMapping("/{id}/response")
    public ResponseEntity<?> updateResponse(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        String response = body.get("response");
        if (response == null || response.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Response cannot be empty");
        }

        service.updateResponse(id, response);
        return ResponseEntity.ok("Response updated");
    }
}
