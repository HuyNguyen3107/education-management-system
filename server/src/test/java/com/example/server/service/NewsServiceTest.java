package com.example.server.service;

import com.example.server.dto.CreateNewsDto;
import com.example.server.dto.NewsResponseDto;
import com.example.server.dto.UpdateNewsDto;
import com.example.server.entity.News;
import com.example.server.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NewsServiceTest {

    @Mock
    private NewsRepository newsRepository;

    @InjectMocks
    private NewsService newsService;

    private News news;
    private CreateNewsDto createNewsDto;
    private UpdateNewsDto updateNewsDto;

    @BeforeEach
    void setUp() {
        news = new News();
        news.setId(UUID.randomUUID());
        news.setTitle("Test News");
        news.setContent("Test Content");

        createNewsDto = new CreateNewsDto();
        createNewsDto.setTitle("New News");
        createNewsDto.setContent("New Content");

        updateNewsDto = new UpdateNewsDto();
        updateNewsDto.setTitle("Updated News");
        updateNewsDto.setContent("Updated Content");
    }

    @Test
    void createNews_ShouldReturnSavedNews() {
        when(newsRepository.save(any(News.class))).thenReturn(news);

        NewsResponseDto result = newsService.createNews(createNewsDto);

        assertNotNull(result);
        assertEquals(news.getTitle(), result.getTitle());
        verify(newsRepository, times(1)).save(any(News.class));
    }

    @Test
    void getNews_ShouldReturnPageOfNews() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<News> newsPage = new PageImpl<>(Arrays.asList(news));

        when(newsRepository.findAll(pageable)).thenReturn(newsPage);

        Page<NewsResponseDto> result = newsService.getNews(null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(news.getTitle(), result.getContent().get(0).getTitle());
    }

    @Test
    void getNewsById_ShouldReturnNews_WhenExists() {
        when(newsRepository.findById(news.getId())).thenReturn(Optional.of(news));

        NewsResponseDto result = newsService.getNewsById(news.getId());

        assertNotNull(result);
        assertEquals(news.getId(), result.getId());
    }

    @Test
    void getNewsById_ShouldThrowException_WhenNotFound() {
        UUID id = UUID.randomUUID();
        when(newsRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> newsService.getNewsById(id));
    }

    @Test
    void updateNews_ShouldReturnUpdatedNews() {
        when(newsRepository.findById(news.getId())).thenReturn(Optional.of(news));
        when(newsRepository.save(any(News.class))).thenReturn(news);

        NewsResponseDto result = newsService.updateNews(news.getId(), updateNewsDto);

        assertNotNull(result);
        assertEquals("Updated News", news.getTitle());
        assertEquals("Updated Content", news.getContent());
    }

    @Test
    void deleteNews_ShouldDeleteNews() {
        when(newsRepository.existsById(news.getId())).thenReturn(true);

        newsService.deleteNews(news.getId());

        verify(newsRepository, times(1)).deleteById(news.getId());
    }

    @Test
    void deleteNewsBatch_ShouldDeleteMultipleNews() {
        List<UUID> ids = Arrays.asList(news.getId());
        when(newsRepository.findAllById(ids)).thenReturn(Arrays.asList(news));

        newsService.deleteNewsBatch(ids);

        verify(newsRepository, times(1)).deleteAll(anyList());
    }
}
