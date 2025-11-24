package com.example.server.controller;

import com.example.server.dto.CreateNewsDto;
import com.example.server.dto.NewsResponseDto;
import com.example.server.dto.UpdateNewsDto;
import com.example.server.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Autowired
    private NewsService newsService;

    /**
     * GET /api/news - Lấy tất cả tin tức
     */
    @GetMapping
    public ResponseEntity<List<NewsResponseDto>> getAllNews() {
        try {
            List<NewsResponseDto> newsList = newsService.getAllNews();
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * GET /api/news/{id} - Lấy tin tức theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable UUID id) {
        try {
            NewsResponseDto news = newsService.getNewsById(id);
            return ResponseEntity.ok(news);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * POST /api/news - Tạo tin tức mới
     */
    @PostMapping
    public ResponseEntity<?> createNews(@Valid @RequestBody CreateNewsDto dto) {
        try {
            NewsResponseDto news = newsService.createNews(dto);
            return ResponseEntity.status(201).body(news);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * PUT /api/news/{id} - Cập nhật tin tức
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(@PathVariable UUID id, @Valid @RequestBody UpdateNewsDto dto) {
        try {
            NewsResponseDto news = newsService.updateNews(id, dto);
            return ResponseEntity.ok(news);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * DELETE /api/news/{id} - Xóa tin tức
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable UUID id) {
        try {
            newsService.deleteNews(id);
            return ResponseEntity.ok("Xóa tin tức thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    /**
     * GET /api/news/search?keyword=... - Tìm kiếm tin tức
     */
    @GetMapping("/search")
    public ResponseEntity<List<NewsResponseDto>> searchNews(@RequestParam String keyword) {
        try {
            List<NewsResponseDto> newsList = newsService.searchNews(keyword);
            return ResponseEntity.ok(newsList);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
