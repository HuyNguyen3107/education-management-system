package com.example.server.repository;

import com.example.server.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MajorRepository extends JpaRepository<Major, UUID> {
}
