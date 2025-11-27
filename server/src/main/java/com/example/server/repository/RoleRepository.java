package com.example.server.repository;

import com.example.server.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    
    /**
     * Tìm role theo tên
     */
    Optional<Role> findByName(String name);
}
