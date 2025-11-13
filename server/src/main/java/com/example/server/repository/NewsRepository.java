package com.example.server.repository;

import com.example.server.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NewsRepository extends JpaRepository<News, UUID> {
    
    // Tìm tin tức theo title (chứa keyword)
    List<News> findByTitleContainingIgnoreCase(String keyword);
}
