package com.example.server.repository;

import com.example.server.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {
    boolean existsByNameIgnoreCase(String name);
}
