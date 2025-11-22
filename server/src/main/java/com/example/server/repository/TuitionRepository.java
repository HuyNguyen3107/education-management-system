package com.example.server.repository;

import com.example.server.entity.Tuition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TuitionRepository extends JpaRepository<Tuition, UUID> {
}
