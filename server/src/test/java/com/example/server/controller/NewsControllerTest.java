package com.example.server.controller;

import com.example.server.dto.CreateNewsDto;
import com.example.server.dto.NewsResponseDto;
import com.example.server.dto.UpdateNewsDto;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtService;
import com.example.server.service.NewsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NewsController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for this test
public class NewsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NewsService newsService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private NewsResponseDto newsResponseDto;
    private CreateNewsDto createNewsDto;
    private UpdateNewsDto updateNewsDto;
    private UUID newsId;

    @BeforeEach
    void setUp() {
        newsId = UUID.randomUUID();
        
        newsResponseDto = new NewsResponseDto();
        newsResponseDto.setId(newsId);
        newsResponseDto.setTitle("Test News");
        newsResponseDto.setContent("Test Content");

        createNewsDto = new CreateNewsDto();
        createNewsDto.setTitle("New News");
        createNewsDto.setContent("New Content");

        updateNewsDto = new UpdateNewsDto();
        updateNewsDto.setTitle("Updated News");
        updateNewsDto.setContent("Updated Content");
    }

    @Test
    void getNews_ShouldReturnPageOfNews() throws Exception {
        Page<NewsResponseDto> page = new PageImpl<>(Collections.singletonList(newsResponseDto));
        when(newsService.getNews(any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test News"));
    }

    @Test
    void getNewsById_ShouldReturnNews() throws Exception {
        when(newsService.getNewsById(newsId)).thenReturn(newsResponseDto);

        mockMvc.perform(get("/api/news/{id}", newsId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test News"));
    }

    @Test
    void createNews_ShouldReturnCreatedNews() throws Exception {
        when(newsService.createNews(any(CreateNewsDto.class))).thenReturn(newsResponseDto);

        mockMvc.perform(post("/api/news")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createNewsDto)))
                .andExpect(status().isCreated());
    }

    @Test
    void updateNews_ShouldReturnUpdatedNews() throws Exception {
        when(newsService.updateNews(eq(newsId), any(UpdateNewsDto.class))).thenReturn(newsResponseDto);

        mockMvc.perform(put("/api/news/{id}", newsId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateNewsDto)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteNews_ShouldReturnOk() throws Exception {
        doNothing().when(newsService).deleteNews(newsId);

        mockMvc.perform(delete("/api/news/{id}", newsId))
                .andExpect(status().isOk());
    }

    @Test
    void deleteNewsBatch_ShouldReturnOk() throws Exception {
        doNothing().when(newsService).deleteNewsBatch(any());

        mockMvc.perform(delete("/api/news/batch")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Collections.singletonList(newsId))))
                .andExpect(status().isOk());
    }
}
