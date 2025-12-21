package com.example.server.service;

import com.example.server.dto.CreateUserRoleDto;
import com.example.server.dto.UpdateUserRoleDto;
import com.example.server.dto.UserRoleResponseDto;
import com.example.server.entity.Role;
import com.example.server.entity.Student;
import com.example.server.entity.Teacher;
import com.example.server.entity.User;
import com.example.server.entity.UserRole;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.StudentRepository;
import com.example.server.repository.TeacherRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserRoleService {

    private static final String ROLE_STUDENT = "STUDENT";
    private static final String ROLE_LECTURER = "LECTURER";

    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    public UserRoleService(
            UserRoleRepository userRoleRepository,
            RoleRepository roleRepository,
            StudentRepository studentRepository,
            TeacherRepository teacherRepository,
            UserRepository userRepository) {
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
    }

    public List<UserRoleResponseDto> getAllUserRoles() {
        return userRoleRepository.findAll().stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public UserRoleResponseDto getUserRoleById(UUID id) {
        UserRole userRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id));
        return new UserRoleResponseDto(userRole);
    }

    public List<UserRoleResponseDto> getUserRolesByUserId(UUID userId) {
        return userRoleRepository.findByUserId(userId).stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    public List<UserRoleResponseDto> getUserRolesByRoleId(UUID roleId) {
        return userRoleRepository.findByRoleId(roleId).stream()
                .map(UserRoleResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserRoleResponseDto createUserRole(CreateUserRoleDto createUserRoleDto) {
        // Check if this user-role combination already exists
        if (userRoleRepository.findByUserIdAndRoleId(createUserRoleDto.getUserId(), createUserRoleDto.getRoleId()).isPresent()) {
            throw new RuntimeException("Người dùng này đã được gán vai trò này");
        }

        UserRole userRole = new UserRole();
        userRole.setUserId(createUserRoleDto.getUserId());
        userRole.setRoleId(createUserRoleDto.getRoleId());

        UserRole savedUserRole = userRoleRepository.save(userRole);

        // Automatically add to Student/Teacher table based on role
        Role role = roleRepository.findById(createUserRoleDto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + createUserRoleDto.getRoleId()));
        
        handleRoleAssignment(createUserRoleDto.getUserId(), role.getName());

        return new UserRoleResponseDto(savedUserRole);
    }

    @Transactional
    public UserRoleResponseDto updateUserRole(UUID id, UpdateUserRoleDto updateUserRoleDto) {
        UserRole userRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id));

        UUID oldUserId = userRole.getUserId();
        UUID oldRoleId = userRole.getRoleId();

        if (updateUserRoleDto.getUserId() != null) {
            userRole.setUserId(updateUserRoleDto.getUserId());
        }

        if (updateUserRoleDto.getRoleId() != null) {
            // Check if the new combination already exists (excluding current record)
            if (updateUserRoleDto.getUserId() != null || updateUserRoleDto.getRoleId() != null) {
                UUID checkUserId = updateUserRoleDto.getUserId() != null ? updateUserRoleDto.getUserId() : userRole.getUserId();
                UUID checkRoleId = updateUserRoleDto.getRoleId() != null ? updateUserRoleDto.getRoleId() : userRole.getRoleId();
                
                userRoleRepository.findByUserIdAndRoleId(checkUserId, checkRoleId).ifPresent(existingUserRole -> {
                    if (!existingUserRole.getId().equals(id)) {
                        throw new RuntimeException("Người dùng này đã được gán vai trò này");
                    }
                });
            }
            userRole.setRoleId(updateUserRoleDto.getRoleId());
        }

        UserRole updatedUserRole = userRoleRepository.save(userRole);

        // Handle role change - remove from old table and add to new table
        if (updateUserRoleDto.getRoleId() != null && !updateUserRoleDto.getRoleId().equals(oldRoleId)) {
            Role oldRole = roleRepository.findById(oldRoleId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò cũ"));
            Role newRole = roleRepository.findById(updateUserRoleDto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò mới"));

            handleRoleRemoval(oldUserId, oldRole.getName());
            handleRoleAssignment(userRole.getUserId(), newRole.getName());
        }

        return new UserRoleResponseDto(updatedUserRole);
    }

    @Transactional
    public void deleteUserRole(UUID id) {
        UserRole userRole = userRoleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phân quyền người dùng với ID: " + id));

        UUID userId = userRole.getUserId();
        UUID roleId = userRole.getRoleId();

        userRoleRepository.deleteById(id);

        // Remove from Student/Teacher table based on role
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò với ID: " + roleId));
        
        handleRoleRemoval(userId, role.getName());
    }

    /**
     * Handle adding user to appropriate table based on role name
     */
    private void handleRoleAssignment(UUID userId, String roleName) {
        if (ROLE_STUDENT.equals(roleName)) {
            addToStudentTable(userId);
        } else if (ROLE_LECTURER.equals(roleName)) {
            addToTeacherTable(userId);
        }
    }

    /**
     * Handle removing user from appropriate table based on role name
     */
    private void handleRoleRemoval(UUID userId, String roleName) {
        if (ROLE_STUDENT.equals(roleName)) {
            removeFromStudentTable(userId);
        } else if (ROLE_LECTURER.equals(roleName)) {
            removeFromTeacherTable(userId);
        }
    }

    /**
     * Add user to students table with generated student code
     */
    private void addToStudentTable(UUID userId) {
        // Check if student already exists
        if (studentRepository.findByUserId(userId).isPresent()) {
            return; // Already exists, skip
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        Student student = new Student();
        student.setUserId(userId);
        // Generate student code from email prefix + timestamp
        String studentCode = generateStudentCode(user.getEmail());
        student.setStudentCode(studentCode);

        studentRepository.save(student);
    }

    /**
     * Add user to teachers table with generated teacher code
     */
    private void addToTeacherTable(UUID userId) {
        // Check if teacher already exists
        if (teacherRepository.findByUserId(userId).isPresent()) {
            return; // Already exists, skip
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        Teacher teacher = new Teacher();
        teacher.setUserId(userId);
        // Generate teacher code from email prefix + timestamp
        String teacherCode = generateTeacherCode(user.getEmail());
        teacher.setTeacherCode(teacherCode);

        teacherRepository.save(teacher);
    }

    /**
     * Remove user from students table
     */
    private void removeFromStudentTable(UUID userId) {
        studentRepository.deleteByUserId(userId);
    }

    /**
     * Remove user from teachers table
     */
    private void removeFromTeacherTable(UUID userId) {
        teacherRepository.deleteByUserId(userId);
    }

    /**
     * Generate student code from email
     * Format: SV_ + email prefix (before @) + _ + last 4 chars of timestamp
     */
    private String generateStudentCode(String email) {
        String prefix = email.split("@")[0].toUpperCase();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String suffix = timestamp.substring(timestamp.length() - 4);
        return "SV_" + prefix + "_" + suffix;
    }

    /**
     * Generate teacher code from email
     * Format: GV_ + email prefix (before @) + _ + last 4 chars of timestamp
     */
    private String generateTeacherCode(String email) {
        String prefix = email.split("@")[0].toUpperCase();
        String timestamp = String.valueOf(System.currentTimeMillis());
        String suffix = timestamp.substring(timestamp.length() - 4);
        return "GV_" + prefix + "_" + suffix;
    }
}

