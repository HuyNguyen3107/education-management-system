package com.example.server.controller;

import com.example.server.dto.NotificationRequestDto;
import com.example.server.dto.NotificationResponseDto;
import com.example.server.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> create(
            @Valid @RequestBody NotificationRequestDto request) {

        try {
            NotificationResponseDto res = service.create(request);
            return ResponseEntity.ok(res);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // ================= GET ALL FOR USER =================
    @GetMapping("/{userId}")
    public ResponseEntity<?> getAll(@PathVariable UUID userId) {
        try {
            List<NotificationResponseDto> list = service.getAllByUser(userId);
            return ResponseEntity.ok(list);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // ================= MARK AS SEEN =================
    @PutMapping("/{id}/seen")
    public ResponseEntity<?> markAsSeen(@PathVariable UUID id) {
        try {
            service.markAsSeen(id);
            return ResponseEntity.ok("Thông báo đã được đánh dấu là đã xem");

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // ================= UPDATE RESPONSE =================
    @PutMapping("/{id}/response")
    public ResponseEntity<?> updateResponse(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        try {
            String response = body.get("response");

            if (response == null || response.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Phản hồi không được để trống");
            }

            service.updateResponse(id, response);
            return ResponseEntity.ok("Phản hồi đã được cập nhật");

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Xoá thông báo thành công");

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    // ================= VALIDATION HANDLER =================
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidation(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(message);
    }

}
