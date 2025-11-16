package com.example.server.service;

import com.example.server.dto.CreateNewsDto;
import com.example.server.dto.NewsResponseDto;
import com.example.server.dto.UpdateNewsDto;
import com.example.server.entity.News;
import com.example.server.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    /**
     * Lấy tất cả tin tức
     */
    public List<NewsResponseDto> getAllNews() {
        return newsRepository.findAll().stream()
                .map(NewsResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tin tức theo ID
     */
    public NewsResponseDto getNewsById(UUID id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức với ID: " + id));
        return new NewsResponseDto(news);
    }

    /**
     * Tạo tin tức mới
     */
    public NewsResponseDto createNews(CreateNewsDto dto) {
        News news = new News();
        news.setTitle(dto.getTitle());
        news.setContent(dto.getContent());

        News savedNews = newsRepository.save(news);
        return new NewsResponseDto(savedNews);
    }

    /**
     * Cập nhật tin tức
     */
    public NewsResponseDto updateNews(UUID id, UpdateNewsDto dto) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức với ID: " + id));

        // Cập nhật các field nếu có giá trị mới
        if (dto.getTitle() != null && !dto.getTitle().trim().isEmpty()) {
            news.setTitle(dto.getTitle());
        }
        if (dto.getContent() != null && !dto.getContent().trim().isEmpty()) {
            news.setContent(dto.getContent());
        }

        News updatedNews = newsRepository.save(news);
        return new NewsResponseDto(updatedNews);
    }

    /**
     * Xóa tin tức
     */
    public void deleteNews(UUID id) {
        if (!newsRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tin tức với ID: " + id);
        }
        newsRepository.deleteById(id);
    }

    /**
     * Tìm kiếm tin tức theo keyword trong title
     */
    public List<NewsResponseDto> searchNews(String keyword) {
        return newsRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(NewsResponseDto::new)
                .collect(Collectors.toList());
    }
}
