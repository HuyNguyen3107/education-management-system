package com.example.server.service;

import com.example.server.dto.MajorRequestDto;
import com.example.server.dto.MajorResponseDto;
import com.example.server.entity.Major;
import com.example.server.repository.MajorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MajorService {

    private final MajorRepository majorRepository;

    public MajorService(MajorRepository majorRepository) {
        this.majorRepository = majorRepository;
    }

    // CREATE
    public MajorResponseDto create(MajorRequestDto req) {

        if (majorRepository.existsByName(req.getName())) {
            throw new IllegalArgumentException("Tên ngành đã tồn tại");
        }

        Major m = new Major();
        m.setName(req.getName());

        return toDto(majorRepository.save(m));
    }

    // GET ALL
    public List<MajorResponseDto> getAll() {
        return majorRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    // GET BY ID
    public MajorResponseDto getById(UUID id) {
        Major m = majorRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy ngành có ID: " + id));
        return toDto(m);
    }

    // UPDATE
    public MajorResponseDto update(UUID id, MajorRequestDto req) {

        Major m = majorRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy ngành để cập nhật"));

        // Check tên trùng ngành khác
        if (majorRepository.existsByName(req.getName())
                && !m.getName().equalsIgnoreCase(req.getName())) {
            throw new IllegalArgumentException("Tên ngành đã tồn tại");
        }

        m.setName(req.getName());

        return toDto(majorRepository.save(m));
    }

    // DELETE
    public void delete(UUID id) {
        if (!majorRepository.existsById(id)) {
            throw new IllegalStateException("Không tìm thấy ngành để xoá");
        }
        majorRepository.deleteById(id);
    }

    // Mapper
    private MajorResponseDto toDto(Major m) {
        MajorResponseDto dto = new MajorResponseDto();
        dto.setId(m.getId());
        dto.setName(m.getName());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setUpdatedAt(m.getUpdatedAt());
        return dto;
    }
}
