package com.example.server.controller;

import com.example.server.dto.AspirationRegisterRequestDto;
import com.example.server.dto.AspirationRegisterResponseDto;
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

    @GetMapping
    public List<AspirationRegisterResponseDto> getAll() {
        return aspirationRegisterService.getAll();
    }

    @GetMapping("/{id}")
    public AspirationRegisterResponseDto getById(@PathVariable UUID id) {
        return aspirationRegisterService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AspirationRegisterResponseDto create(
            @Valid @RequestBody AspirationRegisterRequestDto request) {
        return aspirationRegisterService.create(request);
    }

    @PutMapping("/{id}")
    public AspirationRegisterResponseDto update(
            @PathVariable UUID id,
            @Valid @RequestBody AspirationRegisterRequestDto request) {
        return aspirationRegisterService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        aspirationRegisterService.delete(id);
    }
}
