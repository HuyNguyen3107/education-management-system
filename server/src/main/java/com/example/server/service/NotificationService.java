package com.example.server.service;

import com.example.server.dto.NotificationRequestDto;
import com.example.server.dto.NotificationResponseDto;
import com.example.server.entity.Notification;
import com.example.server.repository.NotificationRepository;
import com.example.server.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;

    public NotificationService(NotificationRepository notificationRepo,
            UserRepository userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }

    // ================= CREATE =================
    public NotificationResponseDto create(NotificationRequestDto req) {

        // Kiểm tra user có tồn tại không
        userRepo.findById(req.getSendTo())
                .orElseThrow(() -> new RuntimeException("Receiver user not found"));

        Notification n = new Notification();
        n.setTitle(req.getTitle());
        n.setContent(req.getContent());
        n.setSendTo(req.getSendTo()); // ❗ SET UUID – KHÔNG PHẢI User Object
        n.setSeenDate(null);
        n.setResponse(null);

        return toResponse(notificationRepo.save(n));
    }

    // =============== GET ALL BY USER ===============
    public List<NotificationResponseDto> getAllByUser(UUID userId) {

        return notificationRepo.findAllBySendToOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ================= MARK AS SEEN =================
    public void markAsSeen(UUID id) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setSeenDate(OffsetDateTime.now().toString());
        notificationRepo.save(n);
    }

    // ================= UPDATE RESPONSE =================
    public void updateResponse(UUID id, String response) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        n.setResponse(response);
        notificationRepo.save(n);
    }

    // ================= CONVERTER =================
    private NotificationResponseDto toResponse(Notification n) {
        return new NotificationResponseDto(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getSendTo(), // ❗ UUID
                n.getSeenDate(),
                n.getResponse(),
                n.getCreatedAt(),
                n.getUpdatedAt());
    }
}
