package com.example.server.service;

import com.example.server.dto.CreateStudentDto;
import com.example.server.dto.StudentResponseDto;
import com.example.server.dto.SubjectResponseDto;
import com.example.server.dto.TrainingProgramDto;
import com.example.server.dto.UpdateStudentDto;
import com.example.server.entity.Student;
import com.example.server.entity.StudentMajor;
import com.example.server.entity.Subject;
import com.example.server.entity.StudentCreditClass;
import com.example.server.entity.CreditClass;
import com.example.server.repository.StudentMajorRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.SubjectRepository;
import com.example.server.repository.StudentCreditClassRepository;
import com.example.server.repository.CreditClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentMajorRepository studentMajorRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudentCreditClassRepository studentCreditClassRepository;

    @Autowired
    private CreditClassRepository creditClassRepository;

    // Lấy tất cả sinh viên

    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(StudentResponseDto::new)
                .collect(Collectors.toList());
    }

    // Lấy sinh viên theo ID

    public StudentResponseDto getStudentById(UUID id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với ID: " + id));
        return new StudentResponseDto(student);
    }

    // Lấy sinh viên theo mã sinh viên
    public StudentResponseDto getStudentByCode(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với mã: " + studentCode));
        return new StudentResponseDto(student);
    }

    // Lấy sinh viên theo user_id
    public StudentResponseDto getStudentByUserId(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với user ID: " + userId));
        return new StudentResponseDto(student);
    }

    // Tạo sinh viên mới
    public StudentResponseDto createStudent(CreateStudentDto dto) {
        // Kiểm tra mã sinh viên đã tồn tại chưa
        if (studentRepository.findByStudentCode(dto.getStudentCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Mã sinh viên đã tồn tại: " + dto.getStudentCode());
        }

        // Kiểm tra user_id đã được gán cho sinh viên khác chưa
        if (studentRepository.findByUserId(dto.getUserId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "User ID đã được gán cho sinh viên khác: " + dto.getUserId());
        }

        Student student = new Student();
        student.setStudentCode(dto.getStudentCode());
        student.setUserId(dto.getUserId());

        Student saved = studentRepository.save(student);
        return new StudentResponseDto(saved);
    }

    // Cập nhật sinh viên

    public StudentResponseDto updateStudent(UUID id, UpdateStudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với ID: " + id));

        if (dto.getStudentCode() != null) {
            if (dto.getStudentCode().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã sinh viên không được để trống.");
            }
            // Kiểm tra mã sinh viên mới có trùng với sinh viên khác không
            studentRepository.findByStudentCode(dto.getStudentCode()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "Mã sinh viên đã tồn tại: " + dto.getStudentCode());
                }
            });
            student.setStudentCode(dto.getStudentCode());
        }

        if (dto.getUserId() != null) {
            // Kiểm tra user_id mới có được gán cho sinh viên khác không
            studentRepository.findByUserId(dto.getUserId()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "User ID đã được gán cho sinh viên khác: " + dto.getUserId());
                }
            });
            student.setUserId(dto.getUserId());
        }

        Student updated = studentRepository.save(student);
        return new StudentResponseDto(updated);
    }

    // Xóa sinh viên
    public void deleteStudent(UUID id) {
        if (!studentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sinh viên với ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    // Lấy chương trình đào tạo của sinh viên dựa trên userId
    public List<TrainingProgramDto> getTrainingProgram(UUID userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy sinh viên với user ID: " + userId));

        List<StudentMajor> studentMajors = studentMajorRepository.findByStudentId(student.getId());

        if (studentMajors.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Sinh viên chưa có ngành/chuyên ngành (Chưa có dữ liệu StudentMajor)");
        }

        // Lấy ngành đầu tiên (nếu có nhiều ngành)
        StudentMajor studentMajor = studentMajors.get(0);

        List<Subject> subjects = subjectRepository.findByMajorIdOrSpecializationId(studentMajor.getMajorId(),
                studentMajor.getSpecializationId());

        // Tìm các môn đã học
        List<StudentCreditClass> studentCreditClasses = studentCreditClassRepository.findByStudentId(student.getId());
        Set<UUID> registeredCreditClassIds = studentCreditClasses.stream()
                .map(StudentCreditClass::getCreditClassId)
                .collect(Collectors.toSet());

        List<CreditClass> creditClasses = creditClassRepository.findAllById(registeredCreditClassIds);
        Set<String> studiedSubjectCodes = creditClasses.stream()
                .map(CreditClass::getSubjectCode)
                .collect(Collectors.toSet());

        Map<String, List<Subject>> grouped = subjects.stream()
                .collect(Collectors.groupingBy(Subject::getSemester));

        List<TrainingProgramDto> result = new ArrayList<>();
        grouped.forEach((semester, subList) -> {
            List<SubjectResponseDto> subDtos = subList.stream()
                    .map(s -> new SubjectResponseDto(s, studiedSubjectCodes.contains(s.getSubjectCode())))
                    .collect(Collectors.toList());
            double total = subList.stream().mapToDouble(s -> s.getNumberOfCredit() != null ? s.getNumberOfCredit() : 0)
                    .sum();
            result.add(new TrainingProgramDto(semester, (float) total, subDtos));
        });

        // Simple sort by semester name
        result.sort((a, b) -> a.getSemester().compareTo(b.getSemester()));

        return result;
    }
}
