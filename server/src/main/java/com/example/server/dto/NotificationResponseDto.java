package com.example.server.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NotificationResponseDto {

    private UUID id;
    private String title;
    private String content;
    private UUID sendTo;
    private String seenDate; // ⭐ KHỚP DATABASE (varchar)
    private String response;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    // Constructor rỗng
    public NotificationResponseDto() {
    }

    // Constructor đầy đủ
    public NotificationResponseDto(
            UUID id,
            String title,
            String content,
            UUID sendTo,
            String seenDate, // ⭐ CHỈNH Ở ĐÂY
            String response,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt) {

        this.id = id;
        this.title = title;
        this.content = content;
        this.sendTo = sendTo;
        this.seenDate = seenDate; // ⭐ String
        this.response = response;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ====== GETTERS & SETTERS ======
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getSendTo() {
        return sendTo;
    }

    public void setSendTo(UUID sendTo) {
        this.sendTo = sendTo;
    }

    public String getSeenDate() {
        return seenDate;
    }

    public void setSeenDate(String seenDate) {
        this.seenDate = seenDate;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
