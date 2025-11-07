# 🚀 Hướng dẫn Setup Server - Education Management System

## 📋 Yêu cầu hệ thống

- **Java**: 25 hoặc cao hơn
- **Maven**: 3.6+ (hoặc dùng Maven wrapper có sẵn)
- **PostgreSQL**: 16.9+
- **Gmail Account**: Để gửi email reset password

---

## ⚙️ Cấu hình Database

### 1. Tạo Database PostgreSQL

```sql
CREATE DATABASE education_management_system;
```

### 2. Tạo bảng Users (nếu chưa có)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    date_of_birth VARCHAR(10) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    education_level VARCHAR(50) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    reset_token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

---

## 📧 Cấu hình Email (Gmail)

### Bước 1: Lấy App Password từ Gmail

1. Vào https://myaccount.google.com/security
2. Bật **"2-Step Verification"** (Xác minh 2 bước)
3. Tìm **"App passwords"** (Mật khẩu ứng dụng)
4. Chọn **"Mail"** và **"Other"** (đặt tên: Education System)
5. Copy mật khẩu **16 ký tự** (dạng: `xxxx xxxx xxxx xxxx`)

### Bước 2: Cấu hình biến môi trường

#### Windows PowerShell:
```powershell
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="xxxx-xxxx-xxxx-xxxx"
```

#### Linux/Mac:
```bash
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="xxxx-xxxx-xxxx-xxxx"
```

#### Hoặc tạo file `.env` (khuyến nghị):
```bash
# Copy file .env.example thành .env
cp .env.example .env

# Sau đó chỉnh sửa .env với thông tin thật
```

---

## 🏃 Chạy Server

### Cách 1: Dùng Maven Wrapper (Khuyến nghị)

#### Windows:
```powershell
# Đặt biến môi trường trước
$env:MAIL_USERNAME="your-email@gmail.com"
$env:MAIL_PASSWORD="your-app-password"

# Chạy server
./mvnw.cmd spring-boot:run
```

#### Linux/Mac:
```bash
# Đặt biến môi trường trước
export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-app-password"

# Chạy server
./mvnw spring-boot:run
```

### Cách 2: Build và chạy JAR

```bash
# Build project
./mvnw clean package

# Chạy JAR với biến môi trường
java -jar target/server-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Test API

### 1. Test Health Check
```bash
curl http://localhost:8080/
# Response: "Welcome to the Education Management System!"
```

### 2. Test Password Reset Request
```bash
curl -X POST http://localhost:8080/api/auth/password-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 3. Test Validate Token
```bash
curl "http://localhost:8080/api/auth/validate-token?token=YOUR_TOKEN"
```

### 4. Test Reset Password
```bash
curl -X POST http://localhost:8080/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","newPassword":"newpassword123"}'
```

---

## 🔒 Bảo mật

### ✅ Đã thực hiện:
- ✅ Mã hóa mật khẩu bằng BCrypt
- ✅ Validation đầu vào với Bean Validation
- ✅ CORS được cấu hình cho localhost:3000 và localhost:5173
- ✅ Token reset có thời hạn 15 phút
- ✅ Biến môi trường cho thông tin nhạy cảm
- ✅ Global Exception Handler
- ✅ Logging với SLF4J
- ✅ UserResponseDto không trả về password

### ⚠️ LƯU Ý:
- **KHÔNG** commit file `.env` vào Git
- **KHÔNG** commit `application.properties` có chứa thông tin nhạy cảm
- File `.env.example` chỉ để tham khảo cấu trúc

---

## 📁 Cấu trúc Project

```
server/
├── src/main/java/com/example/server/
│   ├── config/
│   │   └── SecurityConfig.java          # Cấu hình Spring Security & CORS
│   ├── controller/
│   │   ├── AuthController.java          # API reset password
│   │   └── UserController.java          # API quản lý users
│   ├── dto/
│   │   ├── PasswordResetRequestDto.java # DTO yêu cầu reset
│   │   ├── ResetPasswordDto.java        # DTO reset mật khẩu
│   │   └── UserResponseDto.java         # DTO response user (không có password)
│   ├── entity/
│   │   ├── User.java                    # Entity User
│   │   └── PasswordResetToken.java      # Entity Token
│   ├── exception/
│   │   └── GlobalExceptionHandler.java  # Xử lý exception toàn cục
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── PasswordResetTokenRepository.java
│   ├── service/
│   │   ├── PasswordResetService.java    # Logic reset password
│   │   └── EmailService.java            # Gửi email
│   └── ServerApplication.java           # Main class
└── src/main/resources/
    └── application.properties           # Cấu hình ứng dụng
```

---

## 🐛 Troubleshooting

### Lỗi: "Authentication failed" khi gửi email
- ✅ Kiểm tra đã bật 2-Step Verification chưa
- ✅ Dùng App Password, không phải mật khẩu Gmail thường
- ✅ Kiểm tra biến môi trường `MAIL_USERNAME` và `MAIL_PASSWORD`

### Lỗi: CORS khi gọi từ React
- ✅ Kiểm tra `SecurityConfig.java` đã cấu hình đúng origin chưa
- ✅ Client phải chạy trên port 3000 hoặc 5173

### Lỗi: "Token expired"
- ✅ Token chỉ có hiệu lực 15 phút
- ✅ Yêu cầu reset password lại để nhận token mới

---

## 📞 Liên hệ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ team phát triển.
