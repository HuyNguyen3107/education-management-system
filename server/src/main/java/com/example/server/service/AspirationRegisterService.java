package com.example.server.service;

import com.example.server.dto.AspirationRegisterRequestDto;
import com.example.server.dto.AspirationRegisterResponseDto;
import com.example.server.entity.AspirationRegister;
import com.example.server.repository.AspirationRegisterRepository;
import com.example.server.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class AspirationRegisterService {

    private final AspirationRegisterRepository aspirationRegisterRepository;
    private final StudentRepository studentRepository;

    public AspirationRegisterService(
            AspirationRegisterRepository aspirationRegisterRepository,
            StudentRepository studentRepository) {
        this.aspirationRegisterRepository = aspirationRegisterRepository;
        this.studentRepository = studentRepository;
    }

    public List<AspirationRegisterResponseDto> getAll() {
        return aspirationRegisterRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AspirationRegisterResponseDto getById(UUID id) {
        AspirationRegister entity = aspirationRegisterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy đăng ký nguyện vọng với id: " + id));

        return toResponse(entity);
    }

    public AspirationRegisterResponseDto create(AspirationRegisterRequestDto request) {

        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "student_id không tồn tại.");
        }

        AspirationRegister entity = new AspirationRegister();
        entity.setSubjectCode(request.getSubjectCode().trim());
        entity.setStudentId(request.getStudentId());
        entity.setReason(request.getReason().trim());
        entity.setSemester(request.getSemester().trim());

        return toResponse(aspirationRegisterRepository.save(entity));
    }

    public AspirationRegisterResponseDto update(UUID id, AspirationRegisterRequestDto request) {

        AspirationRegister entity = aspirationRegisterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy đăng ký nguyện vọng với id: " + id));

        if (!studentRepository.existsById(request.getStudentId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "student_id không tồn tại.");
        }

        entity.setSubjectCode(request.getSubjectCode().trim());
        entity.setStudentId(request.getStudentId());
        entity.setReason(request.getReason().trim());
        entity.setSemester(request.getSemester().trim());

        return toResponse(aspirationRegisterRepository.save(entity));
    }

    public void delete(UUID id) {
        if (!aspirationRegisterRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy đăng ký nguyện vọng với id: " + id);
        }

        aspirationRegisterRepository.deleteById(id);
    }

    private AspirationRegisterResponseDto toResponse(AspirationRegister entity) {
        AspirationRegisterResponseDto res = new AspirationRegisterResponseDto();
        res.setId(entity.getId());
        res.setSubjectCode(entity.getSubjectCode());
        res.setStudentId(entity.getStudentId());
        res.setReason(entity.getReason());
        res.setSemester(entity.getSemester());
        res.setCreatedAt(entity.getCreatedAt());
        res.setUpdatedAt(entity.getUpdatedAt());
        return res;
    }
}
