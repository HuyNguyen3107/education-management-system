package com.example.server.controller;

import com.example.server.dto.MajorRequestDto;
import com.example.server.dto.MajorResponseDto;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtService;
import com.example.server.service.MajorService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MajorController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MajorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MajorService majorService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MajorResponseDto majorResponseDto;
    private MajorRequestDto majorRequestDto;
    private UUID majorId;

    @BeforeEach
    void setUp() {
        majorId = UUID.randomUUID();
        
        majorResponseDto = new MajorResponseDto();
        majorResponseDto.setId(majorId);
        majorResponseDto.setName("Information Technology");

        majorRequestDto = new MajorRequestDto();
        majorRequestDto.setName("Information Technology");
    }

    @Test
    void getAll_ShouldReturnPageOfMajors() throws Exception {
        Page<MajorResponseDto> page = new PageImpl<>(Collections.singletonList(majorResponseDto));
        when(majorService.getMajors(anyInt(), anyInt(), any())).thenReturn(page);

        mockMvc.perform(get("/api/majors")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Information Technology"));
    }

    @Test
    void create_ShouldReturnCreatedMajor() throws Exception {
        when(majorService.create(any(MajorRequestDto.class))).thenReturn(majorResponseDto);

        mockMvc.perform(post("/api/majors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(majorRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Information Technology"));
    }

    @Test
    void getById_ShouldReturnMajor() throws Exception {
        when(majorService.getById(majorId)).thenReturn(majorResponseDto);

        mockMvc.perform(get("/api/majors/{id}", majorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Information Technology"));
    }

    @Test
    void update_ShouldReturnUpdatedMajor() throws Exception {
        when(majorService.update(eq(majorId), any(MajorRequestDto.class))).thenReturn(majorResponseDto);

        mockMvc.perform(put("/api/majors/{id}", majorId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(majorRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Information Technology"));
    }

    @Test
    void delete_ShouldReturnSuccessMessage() throws Exception {
        doNothing().when(majorService).delete(majorId);

        mockMvc.perform(delete("/api/majors/{id}", majorId))
                .andExpect(status().isOk())
                .andExpect(content().string("Xoá ngành thành công"));
    }
}
