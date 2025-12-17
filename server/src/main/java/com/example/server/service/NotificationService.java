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

        userRepo.findById(req.getSendTo())
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy người nhận thông báo"));

        if (req.getTitle() == null || req.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Tiêu đề thông báo không được để trống");
        }

        if (req.getContent() == null || req.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Nội dung thông báo không được để trống");
        }

        Notification n = new Notification();
        n.setTitle(req.getTitle());
        n.setContent(req.getContent());
        n.setSendTo(req.getSendTo());
        n.setSeenDate(null);
        n.setResponse(null);

        return toResponse(notificationRepo.save(n));
    }

    // =============== GET BY ID ===============
    public NotificationResponseDto getById(UUID id) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông báo"));
        return toResponse(n);
    }

    // =============== GET ALL BY USER ===============
    public List<NotificationResponseDto> getAllByUser(UUID userId) {

        userRepo.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy người dùng"));

        return notificationRepo.findAllBySendToOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ================= MARK AS SEEN =================
    public void markAsSeen(UUID id) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông báo"));

        n.setSeenDate(OffsetDateTime.now().toString());

        notificationRepo.save(n);
    }

    // ================= UPDATE RESPONSE =================
    public void updateResponse(UUID id, String response) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông báo"));

        if (response == null || response.trim().isEmpty()) {
            throw new IllegalArgumentException("Phản hồi không được để trống");
        }

        n.setResponse(response);
        notificationRepo.save(n);
    }

    // ================= DELETE =================
    public void delete(UUID id) {
        Notification n = notificationRepo.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông báo"));

        notificationRepo.delete(n);
    }

    // ================= CONVERTER =================
    private NotificationResponseDto toResponse(Notification n) {
        return new NotificationResponseDto(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getSendTo(),
                n.getSeenDate(),
                n.getResponse(),
                n.getCreatedAt(),
                n.getUpdatedAt());
    }
}
