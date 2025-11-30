package com.example.server.controller;

import com.example.server.dto.CreateStudentDto;
import com.example.server.dto.StudentResponseDto;
import com.example.server.dto.UpdateStudentDto;
import com.example.server.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    
     // Lấy tất cả sinh viên
     
    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    
     // Lấy sinh viên theo ID
     
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(@PathVariable UUID id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    
     // Lấy sinh viên theo mã sinh viên
     
    @GetMapping("/code/{studentCode}")
    public ResponseEntity<StudentResponseDto> getStudentByCode(@PathVariable String studentCode) {
        StudentResponseDto student = studentService.getStudentByCode(studentCode);
        return ResponseEntity.ok(student);
    }

     // Lấy sinh viên theo user_id
     
    @GetMapping("/user/{userId}")
    public ResponseEntity<StudentResponseDto> getStudentByUserId(@PathVariable UUID userId) {
        StudentResponseDto student = studentService.getStudentByUserId(userId);
        return ResponseEntity.ok(student);
    }

    
     // Tạo sinh viên mới
     
    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(
            @Valid @RequestBody CreateStudentDto dto) {
        StudentResponseDto created = studentService.createStudent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    
     // Cập nhật sinh viên
     
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDto> updateStudent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStudentDto dto) {
        StudentResponseDto updated = studentService.updateStudent(id, dto);
        return ResponseEntity.ok(updated);
    }

   //Xóa sinh viên
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable UUID id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
