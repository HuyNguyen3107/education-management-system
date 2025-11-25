package com.example.server.repository;

import com.example.server.entity.CreditClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CreditClassRepository extends JpaRepository<CreditClass, UUID> {
}
