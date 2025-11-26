package com.example.server.service;

import com.example.server.dto.CreditClassRequestDto;
import com.example.server.dto.CreditClassResponseDto;
import com.example.server.entity.CreditClass;
import com.example.server.repository.CreditClassRepository;
import com.example.server.repository.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class CreditClassService {

    private final CreditClassRepository creditClassRepository;
    private final TeacherRepository teacherRepository;

    public CreditClassService(CreditClassRepository creditClassRepository,
            TeacherRepository teacherRepository) {
        this.creditClassRepository = creditClassRepository;
        this.teacherRepository = teacherRepository;
    }

    public List<CreditClassResponseDto> getAll() {
        return creditClassRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CreditClassResponseDto getById(UUID id) {
        CreditClass creditClass = creditClassRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy lớp tín chỉ với id: " + id));

        return toResponse(creditClass);
    }

    public CreditClassResponseDto create(CreditClassRequestDto request) {

        if (!teacherRepository.existsById(request.getTeacherId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher_id không tồn tại.");
        }

        CreditClass creditClass = new CreditClass();
        creditClass.setSubjectCode(request.getSubjectCode().trim());
        creditClass.setTeacherId(request.getTeacherId());
        creditClass.setGroup(request.getGroup() != null ? request.getGroup().trim() : null);
        creditClass.setName(request.getName().trim());
        creditClass.setQuantity(request.getQuantity());
        creditClass.setRoom(request.getRoom() != null ? request.getRoom().trim() : null);
        creditClass.setSchedule(request.getSchedule().trim());
        creditClass.setSemester(request.getSemester().trim());

        return toResponse(creditClassRepository.save(creditClass));
    }

    public CreditClassResponseDto update(UUID id, CreditClassRequestDto request) {

        CreditClass creditClass = creditClassRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy lớp tín chỉ với id: " + id));

        if (!teacherRepository.existsById(request.getTeacherId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Teacher_id không tồn tại.");
        }

        creditClass.setSubjectCode(request.getSubjectCode().trim());
        creditClass.setTeacherId(request.getTeacherId());
        creditClass.setGroup(request.getGroup() != null ? request.getGroup().trim() : null);
        creditClass.setName(request.getName().trim());
        creditClass.setQuantity(request.getQuantity());
        creditClass.setRoom(request.getRoom() != null ? request.getRoom().trim() : null);
        creditClass.setSchedule(request.getSchedule().trim());
        creditClass.setSemester(request.getSemester().trim());

        return toResponse(creditClassRepository.save(creditClass));
    }

    public void delete(UUID id) {
        if (!creditClassRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy lớp tín chỉ với id: " + id);
        }

        creditClassRepository.deleteById(id);
    }

    private CreditClassResponseDto toResponse(CreditClass creditClass) {
        CreditClassResponseDto res = new CreditClassResponseDto();
        res.setId(creditClass.getId());
        res.setSubjectCode(creditClass.getSubjectCode());
        res.setTeacherId(creditClass.getTeacherId());
        res.setGroup(creditClass.getGroup());
        res.setName(creditClass.getName());
        res.setQuantity(creditClass.getQuantity());
        res.setRoom(creditClass.getRoom());
        res.setSchedule(creditClass.getSchedule());
        res.setSemester(creditClass.getSemester());
        res.setCreatedAt(creditClass.getCreatedAt());
        res.setUpdatedAt(creditClass.getUpdatedAt());
        return res;
    }
}
