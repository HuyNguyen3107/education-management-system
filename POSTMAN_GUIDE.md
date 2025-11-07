# 🧪 HƯỚNG DẪN TEST API VỚI POSTMAN

## 📋 Chuẩn bị

### 1. Chạy Server
```powershell
# Đặt biến môi trường
$env:MAIL_USERNAME="daominhnam2812@gmail.com"
$env:MAIL_PASSWORD="your-app-password"

# Chạy server
cd c:\Users\Nam\education-management-system\server
./mvnw.cmd spring-boot:run
```

### 2. Kiểm tra server đã chạy
- Mở trình duyệt: http://localhost:8080/
- Kết quả: `Welcome to the Education Management System!`

---

## 🔥 FLOW RESET PASSWORD HOÀN CHỈNH

### **Bước 1: Tạo User Test (nếu chưa có)**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/users` (hoặc dùng SQL)

**SQL để tạo user:**
```sql
INSERT INTO users (
    id, email, password_hash, name, phone, date_of_birth, 
    gender, address, status, academic_year, education_level, 
    is_online, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz123456',  -- Password giả
    'Nguyen Van Test',
    '0123456789',
    '2000-01-01',
    'Nam',
    '123 Test Street',
    'active',
    '2024-2025',
    'University',
    false,
    NOW(),
    NOW()
);
```

---

### **Bước 2: Yêu cầu Reset Password**

#### 📨 **API 1: POST /api/auth/password-reset**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/auth/password-reset`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "email": "test@example.com"
}
```

**Response thành công (200 OK):**
```
Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.
```

**Response lỗi validation (400 Bad Request):**
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "email": "Email không hợp lệ"
    }
}
```

**📧 Kiểm tra email:**
- Vào hộp thư `test@example.com`
- Tìm email với tiêu đề: **"Yêu cầu Đặt lại Mật khẩu"**
- Copy token từ link: `http://localhost:3000/reset-password?token=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

---

### **Bước 3: Validate Token**

#### ✅ **API 2: GET /api/auth/validate-token**

**Method:** `GET`  
**URL:** `http://localhost:8080/api/auth/validate-token?token=YOUR_TOKEN_HERE`

**Ví dụ:**
```
http://localhost:8080/api/auth/validate-token?token=123e4567-e89b-12d3-a456-426614174000
```

**Response thành công (200 OK):**
```
Link đặt lại mật khẩu hợp lệ. Bạn có thể tiếp tục.
```

**Response lỗi (400 Bad Request):**
```
Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.
```

---

### **Bước 4: Reset Password**

#### 🔑 **API 3: POST /api/auth/reset-password**

**Method:** `POST`  
**URL:** `http://localhost:8080/api/auth/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "token": "123e4567-e89b-12d3-a456-426614174000",
    "newPassword": "NewSecurePassword123!"
}
```

**Response thành công (200 OK):**
```
Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ.
```

**Response lỗi validation (400 Bad Request):**
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "newPassword": "Mật khẩu phải có ít nhất 8 ký tự"
    }
}
```

**Response lỗi token (400 Bad Request):**
```
Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu link mới.
```

---

## 🧪 TEST CASES QUAN TRỌNG

### ✅ **Test Case 1: Email hợp lệ**
```json
POST /api/auth/password-reset
{
    "email": "test@example.com"
}
```
**Kỳ vọng:** 200 OK + Email được gửi

---

### ❌ **Test Case 2: Email không hợp lệ**
```json
POST /api/auth/password-reset
{
    "email": "invalid-email"
}
```
**Kỳ vọng:** 400 Bad Request
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "email": "Email không hợp lệ"
    }
}
```

---

### ❌ **Test Case 3: Email để trống**
```json
POST /api/auth/password-reset
{
    "email": ""
}
```
**Kỳ vọng:** 400 Bad Request
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "email": "Email không được để trống"
    }
}
```

---

### ❌ **Test Case 4: Token không hợp lệ**
```
GET /api/auth/validate-token?token=invalid-token-123
```
**Kỳ vọng:** 400 Bad Request

---

### ❌ **Test Case 5: Token đã hết hạn (sau 15 phút)**
```
GET /api/auth/validate-token?token=expired-token
```
**Kỳ vọng:** 400 Bad Request

---

### ❌ **Test Case 6: Mật khẩu quá ngắn**
```json
POST /api/auth/reset-password
{
    "token": "valid-token",
    "newPassword": "123"
}
```
**Kỳ vọng:** 400 Bad Request
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "newPassword": "Mật khẩu phải có ít nhất 8 ký tự"
    }
}
```

---

## 📊 **API KHÁC**

### **API 4: GET /api/users (Yêu cầu authentication)**

**Method:** `GET`  
**URL:** `http://localhost:8080/api/users`

**Response thành công (401 Unauthorized - vì chưa login):**
```json
{
    "timestamp": "2025-11-07T...",
    "status": 401,
    "error": "Unauthorized",
    "path": "/api/users"
}
```

**Note:** Endpoint này yêu cầu authentication. Hiện tại Spring Security đang block.

---

### **API 5: GET /hello (Public)**

**Method:** `GET`  
**URL:** `http://localhost:8080/hello?name=John`

**Response:**
```
Hello John!
```

---

## 🔍 **KIỂM TRA DATABASE**

### Xem token đã tạo:
```sql
SELECT * FROM password_reset_tokens;
```

**Kết quả:**
```
id | reset_token                          | user_id                              | created_at          | updated_at
1  | 123e4567-e89b-12d3-a456-426614174000 | f47ac10b-58cc-4372-a567-0e02b2c3d479 | 2025-11-07 15:00:00 | 2025-11-07 15:00:00
```

### Xem password đã được mã hóa:
```sql
SELECT email, password_hash FROM users WHERE email = 'test@example.com';
```

**Kết quả:**
```
email              | password_hash
test@example.com   | $2a$10$N9qo8uLOickgx2ZMRZoMye...  (BCrypt hash)
```

---

## 📝 **POSTMAN COLLECTION**

### Import Collection này vào Postman:

```json
{
    "info": {
        "name": "Education Management System - Password Reset",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "1. Request Password Reset",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"email\": \"test@example.com\"\n}"
                },
                "url": {
                    "raw": "http://localhost:8080/api/auth/password-reset",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "8080",
                    "path": ["api", "auth", "password-reset"]
                }
            }
        },
        {
            "name": "2. Validate Token",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "http://localhost:8080/api/auth/validate-token?token={{token}}",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "8080",
                    "path": ["api", "auth", "validate-token"],
                    "query": [
                        {
                            "key": "token",
                            "value": "{{token}}"
                        }
                    ]
                }
            }
        },
        {
            "name": "3. Reset Password",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"token\": \"{{token}}\",\n    \"newPassword\": \"NewPassword123!\"\n}"
                },
                "url": {
                    "raw": "http://localhost:8080/api/auth/reset-password",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "8080",
                    "path": ["api", "auth", "reset-password"]
                }
            }
        },
        {
            "name": "4. Get All Users",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "http://localhost:8080/api/users",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "8080",
                    "path": ["api", "users"]
                }
            }
        },
        {
            "name": "5. Hello Test",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "http://localhost:8080/hello?name=Postman",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "8080",
                    "path": ["hello"],
                    "query": [
                        {
                            "key": "name",
                            "value": "Postman"
                        }
                    ]
                }
            }
        }
    ],
    "variable": [
        {
            "key": "token",
            "value": "paste-your-token-here"
        }
    ]
}
```

### Cách import:
1. Mở Postman
2. Click **Import** ở góc trái
3. Paste JSON ở trên
4. Click **Import**

---

## 🎯 **WORKFLOW ĐẦY ĐỦ**

```
1. POST /api/auth/password-reset
   ↓
   Body: {"email": "test@example.com"}
   ↓
   ✅ Response: "Nếu email của bạn tồn tại..."
   ↓
   📧 CHECK EMAIL → Copy token từ link
   
2. GET /api/auth/validate-token?token=xxx
   ↓
   ✅ Response: "Link đặt lại mật khẩu hợp lệ"
   
3. POST /api/auth/reset-password
   ↓
   Body: {
       "token": "xxx",
       "newPassword": "NewPassword123!"
   }
   ↓
   ✅ Response: "Mật khẩu của bạn đã được đặt lại thành công"
   
4. CHECK DATABASE
   ↓
   SELECT email, password_hash FROM users
   ↓
   ✅ Password đã được mã hóa BCrypt
```

---

## 🐛 **TROUBLESHOOTING**

### Lỗi: Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:8080
```
**Giải pháp:** Server chưa chạy, chạy lại `./mvnw.cmd spring-boot:run`

---

### Lỗi: Email không được gửi
**Kiểm tra:**
1. Biến môi trường `MAIL_USERNAME` và `MAIL_PASSWORD` đã đặt chưa
2. App Password từ Gmail có đúng không (16 ký tự)
3. Xem log server có lỗi gì không

---

### Lỗi: Token expired
```
Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn
```
**Giải pháp:** Token chỉ có hiệu lực 15 phút. Request lại từ bước 1.

---

## 📚 **TÀI LIỆU THAM KHẢO**

- Setup server: `server/SETUP.md`
- Chi tiết thay đổi: `CHANGELOG.md`
- Cấu hình email: `server/.env.example`

---

**🎉 Chúc bạn test thành công!**
