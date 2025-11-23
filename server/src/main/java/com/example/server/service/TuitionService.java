package com.example.server.service;

import com.example.server.dto.TuitionRequestDto;
import com.example.server.dto.TuitionResponseDto;
import com.example.server.entity.Tuition;
import com.example.server.repository.TuitionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class TuitionService {

    private final TuitionRepository tuitionRepository;

    public TuitionService(TuitionRepository tuitionRepository) {
        this.tuitionRepository = tuitionRepository;
    }

    public List<TuitionResponseDto> getAll() {
        return tuitionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TuitionResponseDto getById(UUID id) {
        Tuition tuition = tuitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy học phí với id: " + id));

        return toResponse(tuition);
    }

    public TuitionResponseDto create(TuitionRequestDto request) {

        Tuition tuition = new Tuition();
        tuition.setPrice(request.getPrice());
        tuition.setSemester(request.getSemester().trim());
        tuition.setYear(request.getYear().trim());
        tuition.setAcademicYear(request.getAcademicYear().trim());

        return toResponse(tuitionRepository.save(tuition));
    }

    public TuitionResponseDto update(UUID id, TuitionRequestDto request) {

        Tuition tuition = tuitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy học phí với id: " + id));

        tuition.setPrice(request.getPrice());
        tuition.setSemester(request.getSemester().trim());
        tuition.setYear(request.getYear().trim());
        tuition.setAcademicYear(request.getAcademicYear().trim());

        return toResponse(tuitionRepository.save(tuition));
    }

    public void delete(UUID id) {
        if (!tuitionRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy học phí với id: " + id);
        }

        tuitionRepository.deleteById(id);
    }

    private TuitionResponseDto toResponse(Tuition tuition) {
        TuitionResponseDto res = new TuitionResponseDto();
        res.setId(tuition.getId());
        res.setPrice(tuition.getPrice());
        res.setSemester(tuition.getSemester());
        res.setYear(tuition.getYear());
        res.setAcademicYear(tuition.getAcademicYear());
        res.setCreatedAt(tuition.getCreatedAt());
        res.setUpdatedAt(tuition.getUpdatedAt());
        return res;
    }
}
