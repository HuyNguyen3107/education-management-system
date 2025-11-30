package com.example.server.service;

import com.example.server.dto.CreateTimeRegisterDto;
import com.example.server.dto.TimeRegisterResponseDto;
import com.example.server.dto.UpdateTimeRegisterDto;
import com.example.server.entity.TimeRegister;
import com.example.server.repository.TimeRegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TimeRegisterService {

    @Autowired
    private TimeRegisterRepository timeRegisterRepository;

    /**
     * Lấy tất cả thời gian đăng ký
     */
    public List<TimeRegisterResponseDto> getAllTimeRegisters() {
        return timeRegisterRepository.findAll().stream()
                .map(TimeRegisterResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thời gian đăng ký theo ID
     */
    public TimeRegisterResponseDto getTimeRegisterById(UUID id) {
        TimeRegister timeRegister = timeRegisterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thời gian đăng ký với ID: " + id));
        return new TimeRegisterResponseDto(timeRegister);
    }

    /**
     * Tạo thời gian đăng ký mới
     */
    public TimeRegisterResponseDto createTimeRegister(CreateTimeRegisterDto dto) {
        TimeRegister timeRegister = new TimeRegister();
        timeRegister.setTypeSemester(dto.getTypeSemester());
        timeRegister.setTypeRegister(dto.getTypeRegister());
        timeRegister.setOpenTime(dto.getOpenTime());
        timeRegister.setEndTime(dto.getEndTime());

        TimeRegister saved = timeRegisterRepository.save(timeRegister);
        return new TimeRegisterResponseDto(saved);
    }

    /**
     * Cập nhật thời gian đăng ký
     */
    public TimeRegisterResponseDto updateTimeRegister(UUID id, UpdateTimeRegisterDto dto) {
        TimeRegister timeRegister = timeRegisterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thời gian đăng ký với ID: " + id));

        if (dto.getTypeSemester() != null && !dto.getTypeSemester().trim().isEmpty()) {
            timeRegister.setTypeSemester(dto.getTypeSemester());
        }
        if (dto.getTypeRegister() != null && !dto.getTypeRegister().trim().isEmpty()) {
            timeRegister.setTypeRegister(dto.getTypeRegister());
        }
        if (dto.getOpenTime() != null && !dto.getOpenTime().trim().isEmpty()) {
            timeRegister.setOpenTime(dto.getOpenTime());
        }
        if (dto.getEndTime() != null && !dto.getEndTime().trim().isEmpty()) {
            timeRegister.setEndTime(dto.getEndTime());
        }

        TimeRegister updated = timeRegisterRepository.save(timeRegister);
        return new TimeRegisterResponseDto(updated);
    }

    /**
     * Xóa thời gian đăng ký
     */
    public void deleteTimeRegister(UUID id) {
        if (!timeRegisterRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thời gian đăng ký với ID: " + id);
        }
        timeRegisterRepository.deleteById(id);
    }

    /**
     * Lấy thời gian đăng ký theo loại học kỳ
     */
    public List<TimeRegisterResponseDto> getByTypeSemester(String typeSemester) {
        return timeRegisterRepository.findByTypeSemester(typeSemester).stream()
                .map(TimeRegisterResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thời gian đăng ký theo loại đăng ký
     */
    public List<TimeRegisterResponseDto> getByTypeRegister(String typeRegister) {
        return timeRegisterRepository.findByTypeRegister(typeRegister).stream()
                .map(TimeRegisterResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * Tìm kiếm theo cả loại học kỳ và loại đăng ký
     */
    public List<TimeRegisterResponseDto> searchByBothTypes(String typeSemester, String typeRegister) {
        return timeRegisterRepository.findByTypeSemesterAndTypeRegister(typeSemester, typeRegister).stream()
                .map(TimeRegisterResponseDto::new)
                .collect(Collectors.toList());
    }
}
