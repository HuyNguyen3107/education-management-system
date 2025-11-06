package com.example.server.entity; // Gói của bạn

import jakarta.persistence.*; // Dùng "javax.persistence" nếu bạn dùng Spring Boot 2
import java.util.Date;

@Entity
public class PasswordResetToken {

    private static final int EXPIRATION_MINUTES = 15; // Token hết hạn sau 15 phút

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    // Liên kết token này với một User
    // Giả sử bạn có file User.java trong com.example.server.entity
    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;

    public PasswordResetToken() {
        super();
    }

    // Constructor để tạo token mới
    public PasswordResetToken(String token, User user) {
        super();
        this.token = token;
        this.user = user;
        this.expiryDate = calculateExpiryDate();
    }
    
    // Hàm tính thời gian hết hạn (15 phút từ bây giờ)
    private Date calculateExpiryDate() {
        return new Date(System.currentTimeMillis() + (EXPIRATION_MINUTES * 60 * 1000));
    }

    // Hàm kiểm tra token còn hạn không
    public boolean isExpired() {
        return new Date().after(this.expiryDate);
    }
    
    // ----- Getters và Setters -----
    public Long getId() { return id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Date getExpiryDate() { return expiryDate; }
    public void setExpiryDate(Date expiryDate) { this.expiryDate = expiryDate; }
}