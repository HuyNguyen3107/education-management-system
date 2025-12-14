package com.example.server.controller;

import com.example.server.dto.AspirationRegisterRequestDto;
import com.example.server.dto.AspirationRegisterResponseDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.service.AspirationRegisterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/aspiration-registers")
public class AspirationRegisterController {

    private final AspirationRegisterService aspirationRegisterService;

    public AspirationRegisterController(AspirationRegisterService aspirationRegisterService) {
        this.aspirationRegisterService = aspirationRegisterService;
    }

    @GetMapping("/student/{studentId}")
    public List<AspirationRegisterResponseDto> getByStudentId(@PathVariable UUID studentId) {
        return aspirationRegisterService.getAspirationsByStudentId(studentId);
    }

    @GetMapping("/available-subjects/{studentId}")
    public List<SubjectResponseDto> getAvailableSubjects(@PathVariable UUID studentId) {
        return aspirationRegisterService.getAvailableSubjects(studentId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AspirationRegisterResponseDto create(
            @Valid @RequestBody AspirationRegisterRequestDto request) {
        return aspirationRegisterService.createAspiration(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        aspirationRegisterService.deleteAspiration(id);
    }
}
