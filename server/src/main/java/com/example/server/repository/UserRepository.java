package com.example.server.repository;

import com.example.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // <-- THAY DÒNG "import java.util.UUID;" BẰNG DÒNG NÀY

@Repository
// SỬA "UUID" THÀNH "Long". ID của User (khóa chính) thường là kiểu Long
public interface UserRepository extends JpaRepository<User, Long> { 
    
    // THÊM PHƯƠNG THỨC NÀY VÀO BÊN TRONG DẤU NGOẶC {}
    // Đây chính là phương thức findByEmail mà file service đang báo lỗi
    Optional<User> findByEmail(String email);

}