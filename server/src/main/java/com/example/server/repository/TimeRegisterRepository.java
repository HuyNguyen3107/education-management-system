package com.example.server.repository;

import com.example.server.entity.TimeRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TimeRegisterRepository extends JpaRepository<TimeRegister, UUID> {
    
    /**
     * Tìm kiếm theo loại học kỳ
     */
    List<TimeRegister> findByTypeSemester(String typeSemester);
    
    /**
     * Tìm kiếm theo loại đăng ký
     */
    List<TimeRegister> findByTypeRegister(String typeRegister);
    
    /**
     * Tìm kiếm theo cả loại học kỳ và loại đăng ký
     */
    List<TimeRegister> findByTypeSemesterAndTypeRegister(String typeSemester, String typeRegister);
}
