package com.example.server.controller;

import com.example.server.dto.CreateNewsDto;
import com.example.server.dto.NewsResponseDto;
import com.example.server.dto.UpdateNewsDto;
import com.example.server.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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
     * GET /api/news - Lấy danh sách tin tức (có phân trang & tìm kiếm)
     */
    @GetMapping
    public ResponseEntity<Page<NewsResponseDto>> getNews(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        try {
            Page<NewsResponseDto> newsPage = newsService.getNews(search, pageable);
            return ResponseEntity.ok(newsPage);
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
     * DELETE /api/news/batch - Xóa nhiều tin tức
     */
    @DeleteMapping("/batch")
    public ResponseEntity<?> deleteNewsBatch(@RequestBody List<UUID> ids) {
        try {
            newsService.deleteNewsBatch(ids);
            return ResponseEntity.ok("Xóa danh sách tin tức thành công");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }
}
