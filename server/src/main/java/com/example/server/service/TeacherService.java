package com.example.server.service;

import com.example.server.dto.TeacherRequestDto;
import com.example.server.dto.TeacherResponseDto;
import com.example.server.entity.Teacher;
import com.example.server.repository.TeacherRepository;
import com.example.server.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public TeacherService(TeacherRepository teacherRepository,
            UserRepository userRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public List<TeacherResponseDto> getAll() {
        return teacherRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TeacherResponseDto getById(UUID id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy giảng viên với id: " + id));

        return toResponse(teacher);
    }

    public TeacherResponseDto create(TeacherRequestDto request) {

        if (!userRepository.existsById(request.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User_id không tồn tại.");
        }

        if (teacherRepository.existsByTeacherCodeIgnoreCase(request.getTeacherCode().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Mã giảng viên đã tồn tại.");
        }

        Teacher teacher = new Teacher();
        teacher.setTeacherCode(request.getTeacherCode().trim());
        teacher.setUserId(request.getUserId());

        return toResponse(teacherRepository.save(teacher));
    }

    public TeacherResponseDto update(UUID id, TeacherRequestDto request) {

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy giảng viên với id: " + id));

        if (!userRepository.existsById(request.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User_id không tồn tại.");
        }

        if (teacherRepository.existsByTeacherCodeIgnoreCase(request.getTeacherCode().trim())
                && !request.getTeacherCode().equalsIgnoreCase(teacher.getTeacherCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Mã giảng viên đã tồn tại.");
        }

        teacher.setTeacherCode(request.getTeacherCode().trim());
        teacher.setUserId(request.getUserId());

        return toResponse(teacherRepository.save(teacher));
    }

    public void delete(UUID id) {
        if (!teacherRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy giảng viên với id: " + id);
        }

        teacherRepository.deleteById(id);
    }

    private TeacherResponseDto toResponse(Teacher teacher) {
        TeacherResponseDto res = new TeacherResponseDto();
        res.setId(teacher.getId());
        res.setTeacherCode(teacher.getTeacherCode());
        res.setUserId(teacher.getUserId());
        res.setCreatedAt(teacher.getCreatedAt());
        res.setUpdatedAt(teacher.getUpdatedAt());
        return res;
    }
}
