package com.example.server.repository;

import com.example.server.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllBySendToOrderByCreatedAtDesc(UUID sendTo);
}
