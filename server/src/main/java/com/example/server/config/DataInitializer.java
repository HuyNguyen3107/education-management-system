package com.example.server.config;

import com.example.server.entity.Role;
import com.example.server.entity.User;
import com.example.server.entity.UserRole;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.UserRoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final String SUPER_ADMIN_EMAIL = "superadmin@gmail.com";
    private static final String SUPER_ADMIN_PASSWORD = "Admin@123";

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        initRoles();
        initSuperAdmin();
    }

    private void initRoles() {
        List<String> defaultRoles = Arrays.asList("ADMIN", "LECTURER", "STUDENT");

        for (String roleName : defaultRoles) {
            roleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName(roleName);
                        Role saved = roleRepository.save(role);
                        System.out.println("Created default role: " + roleName);
                        return saved;
                    });
        }
    }

    private void initSuperAdmin() {
        User superAdmin = userRepository.findByEmail(SUPER_ADMIN_EMAIL).orElseGet(() -> {
            User user = new User();
            user.setEmail(SUPER_ADMIN_EMAIL);
            user.setPasswordHash(passwordEncoder.encode(SUPER_ADMIN_PASSWORD));
            user.setName("Super Admin");
            user.setPhone("0000000000");
            user.setDateOfBirth("2000-01-01");
            user.setGender("Nam");
            user.setAddress("System");
            user.setStatus("Active");
            user.setAcademicYear(null);
            user.setEducationLevel(null);

            User savedUser = userRepository.save(user);
            System.out.println("Created super admin user with email: " + SUPER_ADMIN_EMAIL);
            return savedUser;
        });

        // Đảm bảo super admin luôn có vai trò ADMIN
        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy vai trò ADMIN trong hệ thống"));

        userRoleRepository.findByUserIdAndRoleId(superAdmin.getId(), adminRole.getId())
                .orElseGet(() -> {
                    UserRole userRole = new UserRole(superAdmin.getId(), adminRole.getId());
                    UserRole saved = userRoleRepository.save(userRole);
                    System.out.println("Assigned ADMIN role to super admin user.");
                    return saved;
                });
    }
}


