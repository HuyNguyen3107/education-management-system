package com.example.server.controller;

import com.example.server.dto.DepartmentRequestDto;
import com.example.server.dto.DepartmentResponseDto;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtService;
import com.example.server.service.DepartmentService;
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

@WebMvcTest(DepartmentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class DepartmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DepartmentService departmentService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private DepartmentResponseDto departmentResponseDto;
    private DepartmentRequestDto departmentRequestDto;
    private UUID departmentId;
    private UUID majorId;

    @BeforeEach
    void setUp() {
        departmentId = UUID.randomUUID();
        majorId = UUID.randomUUID();
        
        departmentResponseDto = new DepartmentResponseDto();
        departmentResponseDto.setId(departmentId);
        departmentResponseDto.setName("Software Engineering");
        departmentResponseDto.setMajorId(majorId);
        departmentResponseDto.setMajorName("Information Technology");

        departmentRequestDto = new DepartmentRequestDto();
        departmentRequestDto.setName("Software Engineering");
        departmentRequestDto.setMajorId(majorId);
    }

    @Test
    void getAll_ShouldReturnPageOfDepartments() throws Exception {
        Page<DepartmentResponseDto> page = new PageImpl<>(Collections.singletonList(departmentResponseDto));
        when(departmentService.getDepartments(anyInt(), anyInt(), any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/departments")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Software Engineering"));
    }

    @Test
    void create_ShouldReturnCreatedDepartment() throws Exception {
        when(departmentService.create(any(DepartmentRequestDto.class))).thenReturn(departmentResponseDto);

        mockMvc.perform(post("/api/departments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(departmentRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Software Engineering"));
    }

    @Test
    void getById_ShouldReturnDepartment() throws Exception {
        when(departmentService.getById(departmentId)).thenReturn(departmentResponseDto);

        mockMvc.perform(get("/api/departments/{id}", departmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Software Engineering"));
    }

    @Test
    void update_ShouldReturnUpdatedDepartment() throws Exception {
        when(departmentService.update(eq(departmentId), any(DepartmentRequestDto.class))).thenReturn(departmentResponseDto);

        mockMvc.perform(put("/api/departments/{id}", departmentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(departmentRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Software Engineering"));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(departmentService).delete(departmentId);

        mockMvc.perform(delete("/api/departments/{id}", departmentId))
                .andExpect(status().isNoContent());
    }
}
