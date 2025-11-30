package com.example.server.config;

import com.example.server.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor thủ công thay vì Lombok
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // Mã hóa mật khẩu bằng BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Cấu hình CORS (cho phép tất cả domain gọi API)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // Cấu hình bảo mật chính
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN);
                        }))
                .authorizeHttpRequests(auth -> auth
                        // Logout phải có token (đã đăng nhập)
                        .requestMatchers("/api/auth/logout").authenticated()
                        // Các đường dẫn khác trong /api/auth/** được phép truy cập không cần token
                        .requestMatchers("/api/auth/**").permitAll()
                        // Password reset APIs không cần token
                        .requestMatchers("/api/password-reset/**").permitAll()
                        // News APIs - chỉ GET không cần token
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/news/**").permitAll()
                        // Prerequisite Subjects APIs - tất cả đều cần token
                        .requestMatchers("/api/prerequisite-subjects/**").authenticated()
                        // Time Registers APIs - tất cả đều cần token
                        .requestMatchers("/api/time-registers/**").authenticated()
                        // Subjects APIs - tất cả đều cần token
                        .requestMatchers("/api/subjects/**").authenticated()
                        // Classes APIs - tất cả đều cần token
                        .requestMatchers("/api/classes/**").authenticated()
                        // Mọi request khác đều yêu cầu xác thực
                        .anyRequest().authenticated())
                // Thêm JWT filter vào chuỗi filter của Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
