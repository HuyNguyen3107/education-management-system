# Database Documentation

## Overview
The application uses a PostgreSQL database. The schema is managed by JPA/Hibernate entities.

## Tables
- `users`: Stores user information (Students, Lecturers, Admins).
- `roles`: User roles.
- `permissions`: System permissions.
- `user_roles`: Many-to-many relationship between users and roles.
- `role_permissions`: Many-to-many relationship between roles and permissions.
- `students`: Extended profile for students (linked to `users`).
- `teachers`: Extended profile for teachers (linked to `users`).
- `departments`: Academic departments.
- `majors`: Majors within departments.
- `specializations`: Specializations within majors.
- `subjects`: Subjects/Courses.
- `classes`: Administrative classes.
- `credit_classes`: Credit-based classes (sections).
- `student_credit_classes`: Enrollment records.
- `tuitions`: Tuition fee records.
- `student_tuitions`: Tuition payments by students.
- `time_registers`: Registration periods.
- `aspiration_registers`: Aspiration registrations.
- `news`: News and announcements.
- `notifications`: System notifications.
- `prerequisite_subjects`: Prerequisite rules for subjects.

## Changelog

### 2025-12-08: Remove NOT NULL from User Academic Info
**Reason**: Lecturers and other non-student users do not have an academic year or education level.

**Changes**:
- `users` table:
    - `academic_year`: `NOT NULL` constraint removed.
    - `education_level`: `NOT NULL` constraint removed.

**SQL Migration Command**:
```sql
ALTER TABLE users 
ALTER COLUMN academic_year DROP NOT NULL, 
ALTER COLUMN education_level DROP NOT NULL; 
```

**Application Changes**:
- Updated `User.java` entity to remove `nullable = false` from `academicYear` and `educationLevel`.
- Verified `CreateUserDto` and `UpdateUserDto` allow nulls.
- Frontend `UserFormDialog` already handles these fields conditionally based on role.
