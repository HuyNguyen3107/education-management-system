package com.example.server.service;

import com.example.server.dto.SpecializationRequestDto;
import com.example.server.dto.SpecializationResponseDto;
import com.example.server.entity.Specialization;
import com.example.server.repository.SpecializationRepository;
import com.example.server.repository.MajorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class SpecializationService {

    private final SpecializationRepository specializationRepository;
    private final MajorRepository majorRepository;

    public SpecializationService(SpecializationRepository specializationRepository,
            MajorRepository majorRepository) {
        this.specializationRepository = specializationRepository;
        this.majorRepository = majorRepository;
    }

    public List<SpecializationResponseDto> getAll() {
        return specializationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public SpecializationResponseDto getById(UUID id) {
        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy chuyên ngành với id: " + id));
        return toResponse(specialization);
    }

    public SpecializationResponseDto create(SpecializationRequestDto request) {

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ngành (major_id) không tồn tại.");
        }

        if (specializationRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên chuyên ngành đã tồn tại.");
        }

        Specialization specialization = new Specialization();
        specialization.setName(request.getName().trim());
        specialization.setMajorId(request.getMajorId());

        return toResponse(specializationRepository.save(specialization));
    }

    public SpecializationResponseDto update(UUID id, SpecializationRequestDto request) {

        Specialization specialization = specializationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy chuyên ngành với id: " + id));

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ngành (major_id) không tồn tại.");
        }

        if (specializationRepository.existsByNameIgnoreCase(request.getName().trim())
                && !request.getName().equalsIgnoreCase(specialization.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên chuyên ngành đã tồn tại.");
        }

        specialization.setName(request.getName().trim());
        specialization.setMajorId(request.getMajorId());

        return toResponse(specializationRepository.save(specialization));
    }

    public void delete(UUID id) {
        if (!specializationRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy chuyên ngành với id: " + id);
        }

        specializationRepository.deleteById(id);
    }

    private SpecializationResponseDto toResponse(Specialization specialization) {
        SpecializationResponseDto res = new SpecializationResponseDto();
        res.setId(specialization.getId());
        res.setName(specialization.getName());
        res.setMajorId(specialization.getMajorId());
        res.setCreatedAt(specialization.getCreatedAt());
        res.setUpdatedAt(specialization.getUpdatedAt());
        return res;
    }
}
