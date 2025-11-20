package com.example.server.service;

import com.example.server.dto.DepartmentRequestDto;
import com.example.server.dto.DepartmentResponseDto;
import com.example.server.entity.Department;
import com.example.server.repository.DepartmentRepository;
import com.example.server.repository.MajorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final MajorRepository majorRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
            MajorRepository majorRepository) {
        this.departmentRepository = departmentRepository;
        this.majorRepository = majorRepository;
    }

    public List<DepartmentResponseDto> getAll() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponseDto getById(UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy khoa với id: " + id));
        return toResponse(department);
    }

    public DepartmentResponseDto create(DepartmentRequestDto request) {

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ngành (major_id) không tồn tại.");
        }

        if (departmentRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên khoa đã tồn tại.");
        }

        Department department = new Department();
        department.setName(request.getName().trim());
        department.setMajorId(request.getMajorId());

        return toResponse(departmentRepository.save(department));
    }

    public DepartmentResponseDto update(UUID id, DepartmentRequestDto request) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy khoa với id: " + id));

        if (!majorRepository.existsById(request.getMajorId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ngành (major_id) không tồn tại.");
        }

        if (departmentRepository.existsByNameIgnoreCase(request.getName().trim())
                && !request.getName().equalsIgnoreCase(department.getName())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tên khoa đã tồn tại.");
        }

        department.setName(request.getName().trim());
        department.setMajorId(request.getMajorId());

        return toResponse(departmentRepository.save(department));
    }

    public void delete(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy khoa với id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentResponseDto toResponse(Department department) {
        DepartmentResponseDto res = new DepartmentResponseDto();
        res.setId(department.getId());
        res.setName(department.getName());
        res.setMajorId(department.getMajorId());
        res.setCreatedAt(department.getCreatedAt());
        res.setUpdatedAt(department.getUpdatedAt());
        return res;
    }
}
