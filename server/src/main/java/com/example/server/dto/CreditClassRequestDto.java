package com.example.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreditClassRequestDto {

    @NotBlank(message = "Mã học phần không được để trống.")
    private String subjectCode;

    @NotNull(message = "Teacher_id không được để trống.")
    private UUID teacherId;

    // group có thể null
    private String group;

    @NotBlank(message = "Tên lớp tín chỉ không được để trống.")
    private String name;

    @NotNull(message = "Số lượng sinh viên không được để trống.")
    @Min(value = 1, message = "Số lượng sinh viên phải lớn hơn 0.")
    private Integer quantity;

    // room có thể null
    private String room;

    @NotBlank(message = "Lịch học không được để trống.")
    private String schedule;

    @NotBlank(message = "Học kỳ không được để trống.")
    private String semester;

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public UUID getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(UUID teacherId) {
        this.teacherId = teacherId;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getSchedule() {
        return schedule;
    }

    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}
