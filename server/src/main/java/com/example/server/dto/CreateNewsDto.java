package com.example.server.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateNewsDto {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;

    // Constructors
    public CreateNewsDto() {
    }

    public CreateNewsDto(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // Getters & Setters
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
}
