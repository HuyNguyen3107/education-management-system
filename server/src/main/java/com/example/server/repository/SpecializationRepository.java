package com.example.server.repository;

import com.example.server.entity.Specialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT s FROM Specialization s WHERE (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Specialization> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
