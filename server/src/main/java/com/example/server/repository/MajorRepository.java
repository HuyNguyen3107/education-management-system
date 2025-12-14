package com.example.server.repository;

import com.example.server.entity.Major;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface MajorRepository extends JpaRepository<Major, UUID> {

    // kiểm tra tên ngành có tồn tại chưa
    boolean existsByName(String name);

    // Search by name with pagination
    @Query("SELECT m FROM Major m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Major> searchByName(@Param("keyword") String keyword, Pageable pageable);
}
