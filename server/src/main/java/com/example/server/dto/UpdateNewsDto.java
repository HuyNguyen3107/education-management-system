package com.example.server.dto;

public class UpdateNewsDto {

    private String title;
    private String content;

    // Constructors
    public UpdateNewsDto() {
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
